package com.example.ebaysearch

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

class ItemAdapter (private val products: JSONArray) : RecyclerView.Adapter<ItemAdapter.ItemViewHolder>() {

    class ItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val itemName: TextView = view.findViewById(R.id.product_title)
        val itemCondition: TextView = view.findViewById(R.id.product_condition)
        val itemShipping: TextView = view.findViewById(R.id.product_shipping)
        val itemZip: TextView = view.findViewById(R.id.product_zip)
        val itemPrice: TextView = view.findViewById(R.id.product_price)
        val itemImage: ImageView = view.findViewById(R.id.product_image)

        fun bind(jsonObject: JSONObject) {
            itemName.text = jsonObject.getJSONArray("title").getString(0)
            Glide.with(itemView.context).load(jsonObject.getJSONArray("galleryURL").getString(0)).into(itemImage)
            try {
                itemZip.text = jsonObject.getJSONArray("postalCode").getString(0)
            } catch (e: JSONException) {
                itemZip.text = "N/A"
            }
            try {
                val shipping = jsonObject.getJSONArray("shippingInfo").getJSONObject(0).getJSONArray("shippingServiceCost").getJSONObject(0).getString("__value__")
                if (shipping == "0.0") {
                    itemShipping.text = "Free"
                } else {
                    itemShipping.text = shipping
                }
            } catch (e: JSONException) {
                itemZip.text = "N/A"
            }

            try {
                itemCondition.text = "New"
            } catch (e: JSONException) {
                itemZip.text = "N/A"
            }

            try {
                itemPrice.text = jsonObject.getJSONArray("sellingStatus").getJSONObject(0).getJSONArray("currentPrice").getJSONObject(0).getString("__value__")
            } catch (e: JSONException) {
                itemPrice.text = "N/A"
            }

            itemView.setOnClickListener {
                val context = itemView.context
                val intent = Intent(context, ItemDetailActivity::class.java).apply {
                    putExtra("ITEM_ID", jsonObject.getString("itemId"))
                    putExtra("ITEM_TITLE", jsonObject.getJSONArray("title").getString(0))
                    putExtra("ITEM_INFO", jsonObject.toString())
                }
                context.startActivity(intent)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.result_card, parent, false)
        return ItemViewHolder(view)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.bind(products.getJSONObject(position))
    }

    override fun getItemCount(): Int {
        return products.length()
    }
}