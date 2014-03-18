package com.delis.thessalertn;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import com.loopj.android.http.*;

public class postAlert extends Activity {
    static final int REQUEST_TAKE_PHOTO = 1;
    String mCurrentPhotoPath;
    //ImageView for Camera image
    ImageView img_thumb_view;
    //Title EditText
    EditText titleTextField;
    //Description EditText
    EditText descriptionTextField;
    //Latitude+longitude
    double lat,lng;
    //Alert Catergory
    int alertCategory;
    //Address Textfield
    EditText addressTextField;
    //Actual image file on external storage
    File photoFile;
    //private static AsyncHttpClient client = new AsyncHttpClient();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_post_alert);
        setupUI(findViewById(R.id.parent));
        //Get passed parameters
        Bundle b = getIntent().getExtras();
        //Declare imageview for camera image
        img_thumb_view=(ImageView)findViewById(R.id.imageView);

        titleTextField=(EditText)findViewById(R.id.editText);

        descriptionTextField=(EditText)findViewById(R.id.editText2);

        //Address Edit Textbox
        addressTextField=(EditText)findViewById(R.id.adressTextField);
        //Set address from bundle<-MainActivity
        addressTextField.setText(b.getString("address"));
        //Category
        alertCategory=b.getInt("category");
        //Lat + Lng
        lat=b.getDouble("lat");
        lng=b.getDouble("lng");


        dispatchTakePictureIntent();

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.post_alert, menu);
        restoreActionBar();
        return true;
    }

    public void restoreActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setTitle(R.string.title_activity_post_alert);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.cancel_post) {
            finish();
        }
        if (id == R.id.send_post) {

            send_data();

           //new  send_post_async().execute();
        }
        return super.onOptionsItemSelected(item);
    }
    public void send_data()
    {
        AsyncHttpClient client = new AsyncHttpClient();

        String imagePath=photoFile.getAbsolutePath().toString();
        String urlServer = "http://localhost/iosupload.php";
        long unixTime = System.currentTimeMillis() / 1000L;
        String addr=addressTextField.getText().toString();
        String title=titleTextField.getText().toString();
        String descr=descriptionTextField.getText().toString();

        File myFile = new File(imagePath);
        RequestParams params = new RequestParams();
        try {
            params.put("imagefilename", String.valueOf(unixTime+".jpg"));
            params.put("imgse", myFile);
            params.put("myname","android app");
            params.put("email","android app");
            params.put("address",addr);
            params.put("alert_cat",String.valueOf(alertCategory));
            params.put("title",title);
            params.put("description",descr);
            params.put("latitude",String.valueOf(lat));
            params.put("longitude",String.valueOf(lng));

        } catch(FileNotFoundException e) {
            Log.d("test", "File not found!!!" + imagePath);
        }
        client.post(urlServer, params, new AsyncHttpResponseHandler() {
            public void onSuccess(String response) {
                Log.i("test", response.toString());
                finish();
            }
            public void onStart() {
                super.onStart();
                Log.i("test", "start");
            }
            public void onComplete() {
                super.onStart();
                Log.i("test", "end");
            }

            public void onFailure(String response) {
                Log.i("test", "fail");
                finish();
            }

        });
    }
    private void dispatchTakePictureIntent() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        // Ensure that there's a camera activity to handle the intent
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
            // Create the File where the photo should go
            photoFile = null;
            try {
                photoFile = createImageFile();


            } catch (IOException ex) {
                // Error occurred while creating the File

            }
            // Continue only if the File was successfully created
            if (photoFile != null) {
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT,
                        Uri.fromFile(photoFile));
                startActivityForResult(takePictureIntent, REQUEST_TAKE_PHOTO);
            }
        }
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_TAKE_PHOTO) {
            if (resultCode == RESULT_OK) {
                // Image captured and saved to fileUri specified in the Intent
                BitmapFactory.Options options = new BitmapFactory.Options();
                Bitmap bitmap = BitmapFactory.decodeFile(photoFile.getAbsolutePath().toString());
                img_thumb_view.setImageBitmap(bitmap);
            } else if (resultCode == RESULT_CANCELED) {
                // User cancelled the image capture
                finish();
            } else {
                // Image capture failed, advise user
            }

        }
    }
    private File createImageFile() throws IOException {
        // Create an image file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_PICTURES);
        File image = File.createTempFile(
                imageFileName,  /* prefix */
                ".jpg",         /* suffix */
                storageDir      /* directory */
        );

        // Save a file: path for use with ACTION_VIEW intents
        mCurrentPhotoPath = "file:" + image.getAbsolutePath();
        return image;
    }
    public class send_post_async extends AsyncTask<String, Integer, String> {
        @Override
        protected String doInBackground(String... arg0){
            send_data();
            return null;

        }
        @Override
        protected void onProgressUpdate(Integer... progress) {

        }
        @Override
        protected void onPostExecute(String result){
       finish();
        }

    }
    public static void hideSoftKeyboard(Activity activity) {
        InputMethodManager inputMethodManager = (InputMethodManager)  activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        inputMethodManager.hideSoftInputFromWindow(activity.getCurrentFocus().getWindowToken(), 0);
    }
    public void setupUI(View view) {

        //Set up touch listener for non-text box views to hide keyboard.
        if(!(view instanceof EditText)) {

            view.setOnTouchListener(new View.OnTouchListener() {

                public boolean onTouch(View v, MotionEvent event) {
                    hideSoftKeyboard(postAlert.this);
                    return false;
                }

            });
        }

        //If a layout container, iterate over children and seed recursion.
        if (view instanceof ViewGroup) {

            for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {

                View innerView = ((ViewGroup) view).getChildAt(i);

                setupUI(innerView);
            }
        }
    }
}
