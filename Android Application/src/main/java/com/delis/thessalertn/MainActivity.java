package com.delis.thessalertn;

import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import android.app.ActionBar;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewConfiguration;
import android.widget.ImageButton;
import android.widget.Toast;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import com.parse.Parse;
import com.parse.ParseAnalytics;
import com.parse.ParseInstallation;
import com.parse.PushService;
public class MainActivity extends Activity  {

    //the map
    private GoogleMap theMap;

    //location manager
    private LocationManager locMan;

    //user marker
    //public Marker userMarker;
    public Marker alertMarkers;

    //gpsTracker class
    GPSTracker gpsTracker;
    double userLatitude,userLongitude;  //Declare user location Lat+Lng
    private int currentAlertType=99;    //Default show markers category 99=ALL
    //HashMap<String, HashMap> extraMarkerInfo = new HashMap<String, HashMap>();
    final HashMap <String,String>datamap =new HashMap<String, String>();
    //Need for alertDialog builder
    final Context context = this;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //Parse Library notifications
        Parse.initialize(this, "YOUR PARSE API KEY", "YOUR PARSE APP KEY");
        PushService.setDefaultPushCallback(this, MainActivity.class);
        //Always show Overflow menu(3 dots)
        try {
            ViewConfiguration config = ViewConfiguration.get(this);
            Field menuKeyField = ViewConfiguration.class.getDeclaredField("sHasPermanentMenuKey");
            if(menuKeyField != null) {
                menuKeyField.setAccessible(true);
                menuKeyField.setBoolean(config, false);
            }
        } catch (Exception ex) {
            // Ignore
        }

        //Bug with Bitmapfactory
        try {
            MapsInitializer.initialize(getApplicationContext());
        } catch (GooglePlayServicesNotAvailableException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        //Set Locale to greek for street names
        Locale greek = new Locale("el_GR");
        Locale.setDefault(greek);

        if(theMap==null){
            //get the map
            theMap = ((MapFragment)getFragmentManager().findFragmentById(R.id.the_map)).getMap();
        }
        listenForUserLocation();

        // check if GPS enabled
        gpsTracker = new GPSTracker(this);
        if (gpsTracker.canGetLocation()) //We have gps,get user location
        {
            userLatitude=gpsTracker.latitude;
            userLongitude=gpsTracker.longitude;
            if(userLatitude>40.735 ||userLatitude<40.490 ||userLongitude<22.87||userLongitude>23.050)
            {
            userLatitude=40.628667;
            userLongitude=22.949456;
            }
            //Add user location button on start up ONLY if we have GPS
            //getUserLocation();
        }else                           //We don't have GPS, center map at Thessaloniki
        {
            gpsTracker.showSettingsAlert();
            userLatitude=40.628667;
            userLongitude=22.949456;

        }
        //Create location from gpsTracker class latitude and longitude
        LatLng userLocation = new LatLng(userLatitude,userLongitude);

        //find out if we already have it

            //check in case map/ Google Play services not available
            if(theMap!=null){
                //Add user location marker and listen for changes on location
                listenForUserLocation();
                //ok - proceed
                theMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);
                theMap.setMyLocationEnabled(true);
                theMap.getUiSettings().setZoomControlsEnabled(false);   //Hi
                theMap.getUiSettings().setMyLocationButtonEnabled(true);//Location Button
                theMap.getUiSettings().setZoomControlsEnabled(true);

                //Animate camera to user location or Thessaloniki Center
                theMap.animateCamera(CameraUpdateFactory.newLatLngZoom(userLocation, 12.0f), 3000, null);

                //Load all markers-"99"
                new  MyAsyncTask().execute("99");
            }

        //Add alert button
        ImageButton addAlertBtn = (ImageButton) findViewById(R.id.addAlertButton);
        addAlertBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            //On click add alert button, return address
            public void onClick(View arg0) {
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle(R.string.alert_category)
                        .setItems(R.array.categories, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                // The 'which' argument contains the index position
                                // of the selected item
                                getAddress(which+1);
                                Log.i("test",userLatitude+" "+userLongitude+" "+which);
                            }
                        });
                builder.create();
                builder.show();
            }
        });
    }
    @Override
    public void onPause() {
        super.onPause();
       gpsTracker.stopUsingGPS();
       //gpsTracker=null;
       //Log.i("test","pause");
    }
    @Override
    public void onResume() {
        super.onResume();
        gpsTracker.updateGPSCoordinates();
        //Log.i("test","resume");

    }
    @Override
    public void onStop(){
        super.onStop();
        gpsTracker.stopUsingGPS();

    }

    //Return Address from current location
    private void getAddress(int category){
        //Declare new object
       GPSTracker gpsTrackernew = new GPSTracker(this);
        //Return address only if GPS enable+internet
        if(gpsTrackernew.isGPSEnabled && gpsTrackernew.canGetLocation && gpsTrackernew.isNetworkEnabled){
            gpsTrackernew.updateGPSCoordinates();
            //Log.i("test", String.valueOf(gpsTrackernew.getAddressLine(this)));
            Intent intent = new Intent(MainActivity.this, postAlert.class);
            Bundle b = new Bundle();
            b.putString("address", gpsTrackernew.getAddressLine(this));
            b.putDouble("lat", gpsTrackernew.getLatitude());
            b.putDouble("lng",gpsTrackernew.getLongitude());
            b.putInt("category",category);
            intent.putExtras(b);
            startActivity(intent);
        }
        else{
            //No address->show alert dialog for GPS
            //Log.i("test", "no address");
            gpsTrackernew.showSettingsAlert();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
            // Only show items in the action bar relevant to this screen
            // if the drawer is not showing. Otherwise, let the drawer
            // decide what to show in the action bar.
            getMenuInflater().inflate(R.menu.main, menu);
            restoreActionBar();
            return true;
    }

    public void restoreActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setTitle(R.string.app_name);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        theMap.clear();
        //updateUserLocation();

        int id = item.getItemId();
        switch (id)
        {
            case R.id.alert_all:
                new  MyAsyncTask().execute("99");
                currentAlertType=99;
                if (item.isChecked()) item.setChecked(false);
                else item.setChecked(true);
                break;
            case R.id.alert_kyklo:
                new  MyAsyncTask().execute("1");
                currentAlertType=1;
                if (item.isChecked()) item.setChecked(false);
                else item.setChecked(true);
                break;
            case R.id.alert_politis:
                new  MyAsyncTask().execute("2");
                currentAlertType=2;
                if (item.isChecked()) item.setChecked(false);
                else item.setChecked(true);
                break;
            case R.id.alert_danger:
                new  MyAsyncTask().execute("3");
                currentAlertType=3;
                if (item.isChecked()) item.setChecked(false);
                else item.setChecked(true);
                break;
            case R.id.alert_info:
                new  MyAsyncTask().execute("4");
                currentAlertType=4;
                if (item.isChecked()) item.setChecked(false);
                else item.setChecked(true);
                break;
            case R.id.alert_poria:
                new  MyAsyncTask().execute("5");
                currentAlertType=5;
                if (item.isChecked()) item.setChecked(false);
                else item.setChecked(true);
                break;
            case R.id.main_refresh:
                new MyAsyncTask().execute(String.valueOf(currentAlertType));
                break;
        }

        return super.onOptionsItemSelected(item);
    }
    //TODO:remove user location function
    private void getUserLocation(){
        float bestAccuracy = Float.MAX_VALUE;
        long bestTime = Long.MIN_VALUE;

        //get location manager
        locMan = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        criteria.setAccuracy( Criteria.ACCURACY_COARSE );
        String provider = locMan.getBestProvider( criteria, true );

        if ( provider == null ) {
            Log.e( "LOG", "No location provider found!" );
            return;
        }
        // Acquire a reference to the system Location Manager
        LocationManager locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        LatLng lastLocation= new LatLng(userLatitude, userLongitude);
    }

    private void listenForUserLocation(){
        float bestAccuracy = Float.MAX_VALUE;
        long bestTime = Long.MIN_VALUE;

        //get location manager
        locMan = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        criteria.setAccuracy( Criteria.ACCURACY_COARSE );
        String provider = locMan.getBestProvider( criteria, true );

        if ( provider == null ) {
            Log.e( "LOG", "No location provider found!" );
            return;
        }
        // Acquire a reference to the system Location Manager
        LocationManager locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);

        // Define a listener that responds to location updates
        LocationListener locationListener = new LocationListener() {
            public void onLocationChanged(Location location) {
                // Called when a new location is found by the network location provider.
                userLatitude=location.getLatitude();
                userLongitude=location.getLongitude();
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {}

            public void onProviderEnabled(String provider) {}

            public void onProviderDisabled(String provider) {}
        };
        // Register the listener with the Location Manager to receive location updates
        locationManager.requestLocationUpdates(provider, 0, 0, locationListener);
    }

    private void addAlertsToMap(int alertID,double jLat, double jLng, final String jTitle,int jType, final String jDescription, final String jAddress, final String jTime, final String jImg){
        LatLng jLocation = new LatLng(jLat, jLng);
        //Alert Icons array
        int alertIcons[] =
                {
                        R.drawable.red,
                        R.drawable.blue,
                        R.drawable.yellow,
                        R.drawable.green,
                        R.drawable.purple,
                };
        //Limit snippet to 20 chars
        String snippetString;
        if (jDescription.length() >= 20) {
            snippetString = jDescription.substring(0, 20)+ "...";
        } else {
            snippetString=jDescription;
        }
        //create and set marker properties
       alertMarkers = theMap.addMarker(new MarkerOptions()
                .position(jLocation)
                .title(jTitle)
                .snippet(snippetString)
                .icon(BitmapDescriptorFactory.fromResource(alertIcons[jType-1])));

        datamap.put(alertMarkers.getId(), String.valueOf(alertID));

        theMap.setOnInfoWindowClickListener(new GoogleMap.OnInfoWindowClickListener() {
            @Override
            public void onInfoWindowClick(Marker arg0) {
                //Toast.makeText(MainActivity.this,String.valueOf(datamap.get(arg0.getId())) , 1000).show();// display toast
                Intent intent = new Intent(MainActivity.this, Alert_Details.class);
                if(arg0.isInfoWindowShown()) arg0.hideInfoWindow();
                Bundle b = new Bundle();
                b.putString("title", jTitle);
                b.putString("descr", jDescription);
                b.putString("id", datamap.get(arg0.getId()));
                intent.putExtras(b);
                startActivity(intent); 
            }
        });
    }

        public class MyAsyncTask extends AsyncTask<String, String, Void> {
        InputStream inputStream = null;
        String result = "";

        @Override
        protected Void doInBackground(String... params) {
                String identifier = params[0];
                String url_select = "http://localhost/markers_json_android.php?alt="+identifier;
                //Log.i("TEST", identifier);
            ArrayList<NameValuePair> param = new ArrayList<NameValuePair>();
            try {
                // Set up HTTP post
                // HttpClient is more then less deprecated. Need to change to URLConnection
                HttpClient httpClient = new DefaultHttpClient();
                HttpPost httpPost = new HttpPost(url_select);
                httpPost.setEntity(new UrlEncodedFormEntity(param));
                HttpResponse httpResponse = httpClient.execute(httpPost);
                HttpEntity httpEntity = httpResponse.getEntity();
                // Read content & Log
                inputStream = httpEntity.getContent();
            } catch (UnsupportedEncodingException e1) {
                Log.e("UnsupportedEncodingException", e1.toString());
                e1.printStackTrace();
            } catch (ClientProtocolException e2) {
                Log.e("ClientProtocolException", e2.toString());
                e2.printStackTrace();
            } catch (IllegalStateException e3) {
                Log.e("IllegalStateException", e3.toString());
                e3.printStackTrace();
            } catch (IOException e4) {
                Log.e("IOException", e4.toString());
                e4.printStackTrace();
            }
            // Convert response to string using String Builder
            try {
                BufferedReader bReader = new BufferedReader(new InputStreamReader(inputStream, "iso-8859-1"), 8);
                StringBuilder sBuilder = new StringBuilder();

                String line = null;
                while ((line = bReader.readLine()) != null) {
                    sBuilder.append(line + "\n");
                }

                inputStream.close();
                result = sBuilder.toString();

            } catch (Exception e) {
                Log.e("StringBuilding & BufferedReader", "Error converting result " + e.toString());
            }
            return null;
        } // protected Void doInBackground(String... params)

        protected void onPostExecute(Void v) {

            //parse JSON data
            try{
                JSONArray jArray = new JSONArray(result);
                for(int i=0; i < jArray.length(); i++) {
                    JSONObject jObject = jArray.getJSONObject(i);

                    String alertTitle = jObject.getString("title");
                    String alertDescription=jObject.getString("description");
                    double lat=jObject.getDouble("lat");
                    double lng=jObject.getDouble("lng");
                    int alertType=jObject.getInt("alerttypeid");
                    String alertAddress=jObject.getString("address");
                    String alertTime=jObject.getString("time");
                    String alertImage=jObject.getString("image");
                    int alertID=jObject.getInt("id");


                    addAlertsToMap(alertID,lat, lng, alertTitle,alertType,alertDescription,alertAddress,alertTime,alertImage);
                } // End Loop
            } catch (JSONException e) {
                Log.e("JSONException", "Error: " + e.toString());
            } // catch (JSONException e)
        } // protected void onPostExecute(Void v)
    } //class MyAsyncTask extends AsyncTask<String, String, Void>

    }
