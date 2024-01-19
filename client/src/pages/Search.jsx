import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  console.log("🚀 ~ Search ~ listings:", listings);
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    furnished: false,
    parking: false,
    sort: "createdAt",
    order: "desc",
  });
  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === "all" || id === "rent" || id === "sell") {
      setSidebar({ ...sidebar, type: id });
    } else if (id === "searchTerm") {
      setSidebar({ ...sidebar, searchTerm: value });
    } else if (
      id === "parking" ||
      id === "furnished" ||
      id === "offer" ||
      id === "parking"
    ) {
      setSidebar({
        ...sidebar,
        [id]: checked || checked === "true" ? true : false,
      });
    } else if (id === "sort_order") {
      const sort = value.split("_")[0] || "createdAt";
      const order = value.split("_")[1] || "desc";
      setSidebar({ ...sidebar, sort, order });
    } else {
      setSidebar({ ...sidebar, [id]: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(); //get the information
    urlParams.set("searchTerm", sidebar.searchTerm);
    urlParams.set("type", sidebar.type);
    urlParams.set("offer", sidebar.offer);
    urlParams.set("furnished", sidebar.furnished);
    urlParams.set("parking", sidebar.parking);
    urlParams.set("sort", sidebar.sort);
    urlParams.set("order", sidebar.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const offer = urlParams.get("offer") || false;
    const furnished = urlParams.get("furnished") || false;
    const parking = urlParams.get("parking") || false;
    const sort = urlParams.get("sort") || "createdAt";
    const order = urlParams.get("order") || "desc";
    if (searchTerm || type || offer || furnished || parking || sort || order) {
      setSidebar({
        searchTerm: searchTerm || "",
        type: type || "all",
        offer: offer === "true" ? true : false,
        furnished: furnished === "true" ? true : false,
        parking: parking === "true" ? true : false,
        sort: sort || "createdAt",
        order: order || "desc",
      });
    }
    //fetch the data
    const fetchlistings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchlistings();
  }, [location.search]);

  return (
    //search side
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              onChange={handleChange}
              value={sidebar.searchTerm}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.type === "all"}
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.type === "sell"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebar.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex item-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              className="border rounded-lg p-3"
              id="sort_order"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <h1 className="text-xl font-semibold  p-3 text-slate-700 ">
              No listings found
            </h1>
          )}
          {loading && (
            <h1 className="text-xl font-semibold  p-3 text-slate-700 text-center w-full">
              Loading...
            </h1>
          )}
          {!loading && listings && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))
          }
        </div>
      </div>
    </div>
    //listing side
  );
};

export default Search;
