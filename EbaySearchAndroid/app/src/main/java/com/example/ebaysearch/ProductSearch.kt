package com.example.ebaysearch

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.RadioButton
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest

class ProductSearch : Fragment() {

    lateinit var searchButton: Button
    lateinit var clearButton: Button
    lateinit var keywordEditText: EditText
    lateinit var keywordErrorText: TextView
    lateinit var categorySpinner: Spinner
    var selectedCategoryVal: String = "0"
    lateinit var newCheckBox: CheckBox
    lateinit var usedCheckBox: CheckBox
    lateinit var localPickupCheckBox: CheckBox
    lateinit var freeShippingCheckBox: CheckBox
    lateinit var enableNearbySearchCheckbox: CheckBox
    lateinit var hiddenField: LinearLayout
    lateinit var milesFromText: TextView
    lateinit var zipcodeEnableRadioButton: RadioButton
    lateinit var currentLocationEnableRadioButton: RadioButton
    lateinit var zipcodeEditText: AutoCompleteTextView
    lateinit var zipCodeErrorText: TextView
    lateinit var HOST: String

    private val categoryValueMap = mapOf(
        "All Categories" to "0",
        "Art" to "550",
        "Baby" to "2984",
        "Books" to "267",
        "Clothing, Shoes &amp; Accesories" to "11450",
        "Computers/Tablets &amp; Networking" to "58058",
        "Health &amp; Beauty" to "26395",
        "Music" to "11233",
        "Video Games &amp; Console" to "1249",
    )


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_product_search, container, false)
    }

    private fun setupSpinner() {
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, categoryValueMap.keys.toList())
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        categorySpinner.adapter = adapter

        // Set default value
        val defaultPosition = adapter.getPosition("All Categories")
        categorySpinner.setSelection(defaultPosition)

        categorySpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View, position: Int, id: Long) {
                val selected = parent.getItemAtPosition(position).toString()
                val mappedValue = categoryValueMap[selected]
                if (mappedValue != null) {
                    selectedCategoryVal = mappedValue
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
                // Another interface callback
            }
        }
    }

    private fun setupEnableNearbySearch() {
        enableNearbySearchCheckbox.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                // If the checkbox is checked, make the fields visible
                hiddenField.visibility = View.VISIBLE
                currentLocationEnableRadioButton.isChecked = true
            } else {
                // Otherwise, hide the fields
                hiddenField.visibility = View.GONE
            }
        }
    }

    private fun setZipcodeFunctionality() {
        zipcodeEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                onZipCodeChange(s.toString())
            }

            override fun afterTextChanged(s: Editable?) {
            }
        })

        zipcodeEnableRadioButton.setOnCheckedChangeListener { _, isChecked ->
            zipcodeEditText.isEnabled = isChecked
            currentLocationEnableRadioButton.isChecked = !isChecked
            zipcodeEnableRadioButton.isChecked = isChecked
            if (!isChecked) {
                zipcodeEditText.setText("")
            }
        }
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        HOST = (requireActivity().application as EbaySearchApplication).HOST
        enableNearbySearchCheckbox = view.findViewById(R.id.enableNearbySearchCheckBox)
        hiddenField = view.findViewById(R.id.extraLocationSearch)
        milesFromText = view.findViewById(R.id.milesFromText)
        zipcodeEnableRadioButton = view.findViewById(R.id.zipcodeRadioButton)
        currentLocationEnableRadioButton = view.findViewById(R.id.currentLocationRadioButton)
        zipcodeEditText = view.findViewById(R.id.zipcodeText)
        zipCodeErrorText = view.findViewById(R.id.zipcodeErrorText)
        searchButton = view.findViewById(R.id.searchButton)
        clearButton = view.findViewById(R.id.clearButton)
        keywordEditText = view.findViewById(R.id.keywordEditText)
        keywordErrorText = view.findViewById(R.id.keywordErrorText)
        categorySpinner = view.findViewById(R.id.categorySpinner)
        setupSpinner()
        newCheckBox = view.findViewById(R.id.newCheckBox)
        usedCheckBox = view.findViewById(R.id.usedCheckBox)
        localPickupCheckBox = view.findViewById(R.id.localPickupCheckBox)
        freeShippingCheckBox = view.findViewById(R.id.freeShippingCheckBox)


        setupEnableNearbySearch()
        setZipcodeFunctionality()

        searchButton.setOnClickListener {
            val keyword = keywordEditText.text.toString()
            if (keyword.isBlank()) {
                keywordErrorText.visibility = View.VISIBLE
                Toast.makeText(it.context, "Please fix all fields with errors", Toast.LENGTH_SHORT).show()
            }
            else if (enableNearbySearchCheckbox.isChecked() && zipcodeEnableRadioButton.isChecked() && zipcodeEditText.text.toString().isBlank()) {
                zipCodeErrorText.visibility = View.VISIBLE
                Toast.makeText(it.context, "Please fix all fields with errors", Toast.LENGTH_SHORT).show()
            }
            else {
                keywordErrorText.visibility = View.GONE
                zipCodeErrorText.visibility = View.GONE
                // Perform the search operation
                performSearch()
            }
        }

        clearButton.setOnClickListener {
            keywordEditText.setText("")
            categorySpinner.setSelection(0)
            newCheckBox.isChecked = false
            usedCheckBox.isChecked = false
            localPickupCheckBox.isChecked = false
            freeShippingCheckBox.isChecked = false
            enableNearbySearchCheckbox.isChecked = false
            zipcodeEditText.setText("")
            zipcodeEnableRadioButton.isChecked = false
            currentLocationEnableRadioButton.isChecked = true
            milesFromText.setText("")
        }

    }

    private fun onZipCodeChange(inp: String) {
        if (inp.length >= 5 || inp.length < 1) {
            return
        }
        val url = HOST + "geonames?&initialString=" + inp
        val jsonObjectRequest = JsonObjectRequest(Request.Method.GET, url, null,
            { response ->
                val suggestions = mutableListOf<String>()

                val postalCodesArray = response.getJSONArray("postalCodes")

                for (i in 0 until postalCodesArray.length()) {
                    val jsonObject = postalCodesArray.getJSONObject(i)
                    val value = jsonObject.optString("postalCode")
                    suggestions.add(value)
                }
                val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_dropdown_item_1line, suggestions)
                zipcodeEditText.setAdapter(adapter)
                adapter.notifyDataSetChanged()
                zipcodeEditText.showDropDown()
            },
            { error ->
                Log.e("api", "error")
            })

        val requestQueue = (activity?.application as EbaySearchApplication).requestQueue
        requestQueue.add(jsonObjectRequest)
    }

    private fun performSearch() {
        val intent = Intent(requireContext(), SearchResultsLoading::class.java)
        startActivity(intent)
        val keyword = keywordEditText.text.toString()
        val category = selectedCategoryVal
        val new = newCheckBox.isChecked.toString()
        val used = usedCheckBox.isChecked.toString()
        val localPickup = localPickupCheckBox.isChecked.toString()
        val freeShipping = freeShippingCheckBox.isChecked.toString()

        val extraLocationSearchEnabled = enableNearbySearchCheckbox.isChecked
        var zipCode = "90007"
        var milesFrom = "10"
        if (extraLocationSearchEnabled) {
            milesFrom = milesFromText.text.toString()
            val zipcodeEnabled = zipcodeEnableRadioButton.isChecked
            if (zipcodeEnabled) {
                zipCode = zipcodeEditText.text.toString()
            } else {
                val url = "http://ip-api.com/json/"
                zipCode = "90007"
                val jsonObjectRequest = JsonObjectRequest(Request.Method.GET, url, null,
                    { response ->
                        zipCode = response.getString("zip")
                        Log.i("Retrieved API Zip:", zipCode)
                    },
                    { error ->
                        Log.e("api", "error")
                    })
                val requestQueue = (requireActivity().application as EbaySearchApplication).requestQueue
                requestQueue.add(jsonObjectRequest)
            }
        }
        fetchSearchItems(keyword, category, new, used, localPickup, freeShipping, extraLocationSearchEnabled, zipCode, milesFrom)
    }

    private fun add_param(url: String, key: String, value: String): String {
        return (requireActivity().application as EbaySearchApplication).addParameters(url, key, value)
    }

    private fun fetchSearchItems(keyword: String, category: String, new: String, used: String, localPickup: String, freeShipping: String, extraLocationSearchEnabled: Boolean, zipCode: String, milesFrom: String) {
        var url = HOST + "ebay/find_items_advanced?"
        url = add_param(url, "keywords", keyword);
        url = add_param(url, "buyerPostalCode", zipCode);
        url = add_param(url, "maxDistance", milesFrom);
        if (category != "0") {
            url = add_param(url, "categoryId", category);
        }
        url = add_param(url, "freeShipping", freeShipping);
        url = add_param(url, "localPickup", localPickup);
        url = add_param(url, "conditionNew", new);
        url = add_param(url, "conditionUsed", used);
        val jsonObjectRequest = JsonObjectRequest(Request.Method.GET, url, null,
            { response ->
                val searchResult = response.getJSONObject("searchResult")
                val items = searchResult.getJSONArray("item")
                val intent = Intent(requireContext(), ItemsListActivity::class.java)
                intent.putExtra("itemsArray", items.toString())
                startActivity(intent)
                if (SearchResultsLoading.isActive) {
                    SearchResultsLoading.finishActivity()
                }
            },
            { error ->
                Log.e("fetch items api error", error.toString())
            })

        val requestQueue = (requireActivity().application as EbaySearchApplication).requestQueue
        requestQueue.add(jsonObjectRequest)
    }
}