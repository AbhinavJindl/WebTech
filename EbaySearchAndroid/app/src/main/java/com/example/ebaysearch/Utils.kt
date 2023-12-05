package com.example.ebaysearch

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

fun removeElementAtIndex(jsonArray: JSONArray, index: Int): JSONArray {
    if (index < 0 || index >= jsonArray.length()) {
        throw IndexOutOfBoundsException("Index: $index, Size: ${jsonArray.length()}")
    }

    val newArray = JSONArray()
    for (i in 0 until jsonArray.length()) {
        if (i != index) {
            newArray.put(jsonArray.get(i))
        }
    }
    return newArray
}

fun saveData(context: Context, value: JSONArray) {
    val sharedPreferences = context.getSharedPreferences("WishlistItems", Context.MODE_PRIVATE)
    val editor = sharedPreferences.edit()

    editor.putString("items", value.toString())
    editor.apply()
}

fun findItem(items: JSONArray, itemId: String): Int? {
    for (i in 0 until items.length()) {
        if (items.getJSONObject(i).getString("itemId") == itemId) {
            return i
        }
    }
    return null
}

fun clearData(context: Context) {
    val sharedPreferences = context.getSharedPreferences("WishlistItems", Context.MODE_PRIVATE)
    sharedPreferences.edit().clear().apply()
}

fun retrieveData(context: Context): JSONArray {
    val sharedPreferences = context.getSharedPreferences("WishlistItems", Context.MODE_PRIVATE)
    return JSONArray(sharedPreferences.getString("items", "[]"))
}