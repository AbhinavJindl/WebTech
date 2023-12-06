package com.example.ebaysearch

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.bumptech.glide.Glide
import org.json.JSONObject

private const val ARG_PARAM1 = "itemId"
private const val ARG_PARAM2 = "itemInfo"

class PhotosFragment : Fragment() {
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ImageAdapter
    private lateinit var itemId: String
    private lateinit  var itemInfo: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            itemId = it.getString(ARG_PARAM1, "")
            itemInfo = it.getString(ARG_PARAM2, "")
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_photos, container, false)
        recyclerView = view.findViewById(R.id.recyclerViewImages)
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.setHasFixedSize(true)
        loadSimilarPhotos(JSONObject(itemInfo).getJSONArray("title").getString(0))
        return view
    }

    private fun loadSimilarPhotos(text: String) {
        val application = (requireActivity().application as EbaySearchApplication)
        val host = application.HOST
        var url = host + "google/similar_photos?"

        url = application.addParameters(url, "queryText", text.replace(Regex("[^a-zA-Z0-9\\s-]"), ""))
        val imageUrlsFromApi = ArrayList<String>()
        val jsonObjectRequest = JsonObjectRequest(
            Request.Method.GET, url, null,
            { response ->
                val items = response.getJSONArray("items")
                for (i in 0 until items.length()) {
                    val item = items.getJSONObject(i)
                    imageUrlsFromApi.add(item.getString("link"))
                }
                adapter = ImageAdapter(imageUrlsFromApi)
                recyclerView.adapter = adapter
            },
            { error ->
                Log.e("fetch detail api error", error.toString())
            })

        val requestQueue = application.requestQueue
        requestQueue.add(jsonObjectRequest)
    }

    companion object {
        @JvmStatic
        fun newInstance(itemId: String, itemInfo: String) =
            PhotosFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, itemId)
                    putString(ARG_PARAM2, itemInfo)
                }
            }
    }
}

class ImageAdapter(private val imageUrls: ArrayList<String>) : RecyclerView.Adapter<ImageAdapter.ImageViewHolder>() {

    inner class ImageViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageView: ImageView = view.findViewById(R.id.imageView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ImageViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.photos_tab_layout, parent, false)
        return ImageViewHolder(view)
    }

    override fun onBindViewHolder(holder: ImageViewHolder, position: Int) {
        // Load image using Glide or another library
        Glide.with(holder.imageView.context)
            .load(imageUrls[position])
            .centerInside()
            .into(holder.imageView)
    }

    override fun getItemCount(): Int = imageUrls.size
}
