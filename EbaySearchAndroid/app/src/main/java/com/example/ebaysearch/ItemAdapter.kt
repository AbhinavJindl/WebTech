package com.example.ebaysearch

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

class ItemAdapter (public var products: JSONArray, isWishlist: Boolean) : RecyclerView.Adapter<ItemAdapter.ItemViewHolder>() {
    private lateinit var context: Context
    private var isWishlistTab: Boolean = isWishlist

    class ItemViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val itemName: TextView = view.findViewById(R.id.product_title)
        val itemCondition: TextView = view.findViewById(R.id.product_condition)
        val itemShipping: TextView = view.findViewById(R.id.product_shipping)
        val itemZip: TextView = view.findViewById(R.id.product_zip)
        val itemPrice: TextView = view.findViewById(R.id.product_price)
        val itemImage: ImageView = view.findViewById(R.id.product_image)
        val wishlistIcon: ImageView = view.findViewById(R.id.wishlistIcon)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        context = parent.context
        val view = LayoutInflater.from(parent.context).inflate(R.layout.result_card, parent, false)
        return ItemViewHolder(view)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        val jsonObject = products.getJSONObject(position)
        val title = jsonObject.getJSONArray("title").getString(0)
        holder.itemName.text = title
        Glide.with(holder.itemView.context).load(jsonObject.getJSONArray("galleryURL").getString(0)).into(holder.itemImage)
        val wishListItemIndex = findItem(retrieveData(context), jsonObject.getString("itemId"))
        if (wishListItemIndex == null) {
            holder.wishlistIcon.setImageResource(R.drawable.cart_plus)
            holder.wishlistIcon.setOnClickListener{
                val updatedItems = retrieveData(context).put(jsonObject)
                saveData(context, updatedItems)
                Toast.makeText(it.context, "${title.substring(0, 9)}... was added to wishlist", Toast.LENGTH_LONG).show()
                if (isWishlistTab) {
                    products = retrieveData(context)
                }
                this@ItemAdapter.notifyDataSetChanged()
            }

        } else {
            holder.wishlistIcon.setImageResource(R.drawable.cart_remove)
            holder.wishlistIcon.setOnClickListener{
                val updatedItems = removeElementAtIndex(retrieveData(context), wishListItemIndex)
                saveData(context, updatedItems)
                Toast.makeText(it.context, "${title.substring(0, 9)}... was removed from wishlist", Toast.LENGTH_LONG).show()
                if (isWishlistTab) {
                    products = retrieveData(context)
                }
                this@ItemAdapter.notifyDataSetChanged()
            }
        }

        try {
            holder.itemZip.text = jsonObject.getJSONArray("postalCode").getString(0)
        } catch (e: JSONException) {
            holder.itemZip.text = "N/A"
        }
        try {
            val shipping = jsonObject.getJSONArray("shippingInfo").getJSONObject(0).getJSONArray("shippingServiceCost").getJSONObject(0).getString("__value__")
            if (shipping == "0.0") {
                holder.itemShipping.text = "Free"
            } else {
                holder.itemShipping.text = shipping
            }
        } catch (e: JSONException) {
            holder.itemZip.text = "N/A"
        }

        try {
            holder.itemCondition.text = "New"
        } catch (e: JSONException) {
            holder.itemZip.text = "N/A"
        }

        try {
            holder.itemPrice.text = jsonObject.getJSONArray("sellingStatus").getJSONObject(0).getJSONArray("currentPrice").getJSONObject(0).getString("__value__")
        } catch (e: JSONException) {
            holder.itemPrice.text = "N/A"
        }

        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, ItemDetailActivity::class.java).apply {
                putExtra("ITEM_ID", jsonObject.getString("itemId"))
                putExtra("ITEM_TITLE", jsonObject.getJSONArray("title").getString(0))
                putExtra("ITEM_INFO", jsonObject.toString())
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int {
        return products.length()
    }
}