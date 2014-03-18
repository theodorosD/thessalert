package com.delis.thessalertn;

import android.app.Activity;
import android.app.ActionBar;
import android.app.Fragment;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.os.Build;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

public class AlertImageFullscreen extends Activity {
    private ImageView img_view;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // remove title
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_alert_image_fullscreen);
        //Get extra passed from Alert_details
        Bundle b = getIntent().getExtras();
        //Get alert image for SD card
        final String imageInSD = Environment.getExternalStorageDirectory().getAbsolutePath()+ "/Thessaloniki/"+b.getString("image");
        img_view=(ImageView)findViewById(R.id.imageView);
        new loadImage().execute(imageInSD);
        this.img_view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
            finish();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.

        return super.onOptionsItemSelected(item);
    }

    public class loadImage extends AsyncTask<String, Integer, String> {
        Bitmap bitmap;
        @Override
        protected String doInBackground(String... arg0){
            //Decode image from SD card
            bitmap = (Bitmap) BitmapFactory.decodeFile(arg0[0].toString());
            return null;

        }
        @Override
        protected void onProgressUpdate(Integer... progress) {

        }
        @Override
        protected void onPostExecute(String result){
            //Load Image
            img_view.setImageBitmap(bitmap);
        }

    }

}
