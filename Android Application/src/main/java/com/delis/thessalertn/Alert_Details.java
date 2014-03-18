package com.delis.thessalertn;

import android.app.Activity;
import android.app.ActionBar;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

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
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

public class Alert_Details extends Activity {
    private ImageView img_thumb_view;
    private Bitmap thumb_alert_image;
    private Bitmap full_alert_image;
    private TextView alert_address_textview;
    private TextView alert_time_textview;
    private String alertImage;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_alert_details);
        //Get passed parameters
        Bundle b = getIntent().getExtras();
        //Declare our UI
        TextView alert_title_textview = (TextView)findViewById(R.id.alert_details_title_text);
        TextView alert_description_textview = (TextView)findViewById(R.id.alert_details_descr_text);
        alert_address_textview = (TextView)findViewById(R.id.alert_details_address_text);
        alert_time_textview = (TextView)findViewById(R.id.alert_details_time_text);
        img_thumb_view=(ImageView)findViewById(R.id.imageView);

        //Set title and description text from Bundle
        alert_title_textview.setText(b.getString("title"));
        alert_description_textview.setText(b.getString("descr"));
        //Lets download more data+images
        new  getJson().execute(b.getString("id"));

        //User touch image
        this.img_thumb_view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Alert_Details.this, AlertImageFullscreen.class);
                /*ByteArrayOutputStream stream = new ByteArrayOutputStream();
                full_alert_image.compress(Bitmap.CompressFormat.PNG, 100, stream);
                byte[] byteArray = stream.toByteArray();
                intent.putExtra("image", byteArray);
                full_alert_image.getGenerationId();
                */
                Bundle b = new Bundle();
                b.putString("image", alertImage);
                intent.putExtras(b);
                startActivity(intent);

            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.alert_details, menu);
        //Call action bar function with settings
        restoreActionBar();
        return true;
    }

    public void restoreActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setTitle(R.string.alert_details_activity_title);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        if (id == R.id.alert_close) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public class getJson extends AsyncTask<String, String, Void> {
        InputStream inputStream = null;
        String result = "";

        @Override
        protected Void doInBackground(String... params) {
            String identifier = params[0];
            String url_select = "http://localhost/android/single_marker_json_android.php?id="+identifier;
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
                    alertImage=jObject.getString("image");
                    int alertID=jObject.getInt("id");
                    alert_address_textview.setText(alertAddress);
                    alert_time_textview.setText(alertTime);
                    new downloadImages().execute(alertImage);

                } // End Loop
            } catch (JSONException e) {
                Log.e("JSONException", "Error: " + e.toString());
            } // catch (JSONException e)
        } // protected void onPostExecute(Void v)
    } //class MyAsyncTask extends AsyncTask<String, String, Void>

    public class downloadImages extends AsyncTask<String, Integer, String> {

        @Override
        protected String doInBackground(String... arg0){
            String file_path = Environment.getExternalStorageDirectory().getAbsolutePath() +
                    "/Thessaloniki/";
            File image_thumb_file = new File(file_path+"thumb_"+arg0[0].toString());
            File image_full_file = new File(file_path+arg0[0].toString());

            if(image_thumb_file.exists())
            {
                thumb_alert_image= BitmapFactory.decodeFile(image_thumb_file.toString());
                full_alert_image= BitmapFactory.decodeFile(image_full_file.toString());
            }else{
            URL img_thumb_URL=null;
            URL img_URL=null;
            try{
                img_thumb_URL=new URL("http://localhost/assets/alertimages/thumb_"+arg0[0].toString());
                img_URL=new URL("http://localhost/assets/alertimages/"+arg0[0].toString());
            }catch (MalformedURLException e1){
                e1.printStackTrace();
            }
            try{
                thumb_alert_image= BitmapFactory.decodeStream(img_thumb_URL.openConnection().getInputStream());
                full_alert_image= BitmapFactory.decodeStream(img_URL.openConnection().getInputStream());

                File dir = new File(file_path);
                if(!dir.exists())
                    dir.mkdirs();
                //file = new File(dir, arg0[0].toString());
                FileOutputStream fOut1 = new FileOutputStream(image_thumb_file);
                FileOutputStream fOut2 = new FileOutputStream(image_full_file);
                if(arg0[0].toString()=="noalert.png"){
                    thumb_alert_image.compress(Bitmap.CompressFormat.PNG, 100, fOut1);
                    full_alert_image.compress(Bitmap.CompressFormat.PNG, 100, fOut2);

                }else{
                    thumb_alert_image.compress(Bitmap.CompressFormat.JPEG, 100, fOut1);
                    full_alert_image.compress(Bitmap.CompressFormat.JPEG, 100, fOut2);
                }

                fOut1.flush();
                fOut1.close();
                fOut2.flush();
                fOut2.close();
            }catch (IOException e){
                e.printStackTrace();
            }
            }
        return null;

        }
        @Override
        protected void onProgressUpdate(Integer... progress) {

        }
        @Override
        protected void onPostExecute(String result){
            img_thumb_view.setImageBitmap(thumb_alert_image);
        }

    }
}
