package com.t2s.LocationService;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.t2s.R;


public class GeoLocationService extends Service {
    public static final String FOREGROUND = "com.d2s.location.FOREGROUND";
    public static final String CHANNEL_ID = "d2s_channel";
    private static int GEOLOCATION_NOTIFICATION_ID = 12345689;
    LocationManager locationManager = null;
    LocationListener locationListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            GeoLocationService.this.sendMessage(location);
        }

        @Override
        public void onStatusChanged(String s, int i, Bundle bundle) {
        }

        @Override
        public void onProviderEnabled(String s) {
        }

        @Override
        public void onProviderDisabled(String s) {
        }
    };

    @Override
    public void onCreate() {
        locationManager = (LocationManager) getApplicationContext().getSystemService(LOCATION_SERVICE);

        int permissionCheck = ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION);
        if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 50, locationListener);
        }
    }

    private void sendMessage(Location location) {
        try {
            Intent intent = new Intent("GeoLocationUpdate");
            intent.putExtra("message", location);
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        locationManager.removeUpdates(locationListener);
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundServiceAfterO();
        } else {
            startForeground(GEOLOCATION_NOTIFICATION_ID, getCompatNotification());
        }
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private Notification getCompatNotification() {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID);
        String str = "is using your location in the background";
        builder
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                .setContentTitle("Drive2Success")
                .setContentText(str)
                .setTicker(str)
                .setOngoing(true)
                .setWhen(System.currentTimeMillis());
        Intent startIntent = new Intent();
        PendingIntent contentIntent = PendingIntent.getActivity(this, 1000, startIntent, 0);
        builder.setContentIntent(contentIntent);
        return builder.build();
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private void startForegroundServiceAfterO() {
        String NOTIFICATION_CHANNEL_ID = "com.ignite_drive2success";
        String str = "is using your location in the background";
        NotificationChannel chan = new NotificationChannel(NOTIFICATION_CHANNEL_ID, CHANNEL_ID, NotificationManager.IMPORTANCE_HIGH);
        chan.setLightColor(Color.GRAY);
        chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        assert manager != null;
        manager.createNotificationChannel(chan);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID);
        Notification notification = notificationBuilder.setOngoing(true)
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                .setContentTitle("Drive2Success")
                .setTicker(str)
                .setContentText(str)
                .setPriority(NotificationManager.IMPORTANCE_MIN)
                .setCategory(Notification.CATEGORY_SERVICE)
                .setOngoing(true)
                .setWhen(System.currentTimeMillis())
                .build();
        startForeground(GEOLOCATION_NOTIFICATION_ID, notification);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Location Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }

}
