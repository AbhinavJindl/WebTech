package com.example.ebaysearch

import android.app.Application
import com.android.volley.RequestQueue
import com.android.volley.toolbox.Volley

class EbaySearchApplication: Application() {
    public val HOST: String = "http://10.0.2.2:8080/"

    public fun addParameters(url: String, key: String, value: String): String {
        return "$url&$key=$value"
    }

    lateinit var requestQueue: RequestQueue
        private set

    override fun onCreate() {
        super.onCreate()
        requestQueue = Volley.newRequestQueue(applicationContext)
    }
}