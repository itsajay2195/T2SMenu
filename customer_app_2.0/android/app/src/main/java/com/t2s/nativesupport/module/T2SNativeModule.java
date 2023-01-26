package com.t2s.nativesupport.module;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.t2s.BuildConfig;


public class T2SNativeModule extends ReactContextBaseJavaModule {
    public T2SNativeModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "T2SNativeModule";
    }
}
