import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import Swal from "sweetalert2";
import { API_ROOT } from "../../utils/constants";
function ListProduct() {

  const [allproducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filters, setFilters] = useState({
    sort: 'name',
    order: 'asc',
    date: 'null'
  })
  const fetchInfo = async () => {
    await fetch(`${API_ROOT}/allproduct`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.data);
      });
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  // console.log('filters', filters)
  // console.log('allproduct', allproducts)
  const remainProducts = () => {
    if (allproducts) {
      let filteredProducts = [...allproducts];
      if (searchTerm.trim() !== '') {
        filteredProducts = filteredProducts.filter((product) => (
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      }
      if (selectedCategory !== "All") {
        // Nếu có loại danh mục được chọn, lọc theo loại danh mục
        filteredProducts = filteredProducts.filter(
          (product) => product.category === selectedCategory
        );
      }
      //  săps xếp theo trường
      const { sort, order, date } = filters
      filteredProducts.sort((a, b) => {
        if (sort === 'name') {
          if (order === 'asc') {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        }
        else if (sort === 'price') {
          if (order === 'asc') {
            return a.new_price - b.new_price
          } else {
            return b.new_price - a.new_price
          }
        }
        else if (sort === 'date') {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)

          const currentDate = new Date()
          const diffA = Math.abs(currentDate - dateA)
          const diffB = Math.abs(currentDate - dateB)
          if (order === 'asc') {
            return diffA - diffB
          }
          else if (order === 'desc') {
            return diffB - diffA
          }
        }
        return 0;
      })

      return filteredProducts;
    }
  }
  // const remainProductList = remainProducts()
  const removeProduct = async (id) => {
    Swal.fire({
      title: "Confirm remove cart item",
      text: "Are you sure to remove this cart item",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`${API_ROOT}/removeproduct`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
        fetchInfo();
      }
    });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };


  const handleChangeField = (e) => {
    setFilters({
      ...filters,
      sort: e.target.value
    })
  }
  const handleChangeSort = (e) => {
    setFilters({
      ...filters,
      order: e.target.value
    })
  }
  return (
    <div className="mx-4 p-5 mt-3 vh-100 bg-white">
      <h1 className="text-center mb-5">All Product List</h1>
      <div className="row col-sm-12 col-md-12 col-lg-12 cart-table-wrapper">
        <div className="col-md-6 mb-3 py-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="d-flex flex-column col-md-6 mb-3  py-2">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option disabled>Please choose category</option>
            <option className="text-dark" value="All">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
          </select>
          <div className="d-flex align-items-center  mt-4">
            <div className="d-flex align-items-center me-4">
              <span className="badge bg-danger me-2  fs-6">Field</span>
              <select
                className="form-select form-select-sm"
                defaultChecked={'name'}
                onChange={handleChangeField}
              >
                <option value="name">Name</option>
                <option value="price">New Price</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div className="d-flex align-items-center me-2">
              <span className="badge bg-success me-2  fs-6">Sort</span>
              <select
                className="form-select form-select-sm"
                defaultValue={'asc'}
                onChange={handleChangeSort}
              >
                <option value="asc">Ascendent</option>
                <option value="desc">Descendent</option>
              </select>
            </div>
          </div>
        </div>
        <table className="table cart-table">
          <thead>
            <tr>
              <th className="text-center">Product</th>
              <th className="text-center">Title</th>
              <th className="text-center">Old Price</th>
              <th className="text-center">New Price</th>
              <th className="text-center">Category</th>
              <th className="text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {remainProducts() && remainProducts().map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      className="product-image"
                      src={product.image}
                      alt=""
                    />
                  </div>
                </td>
                <td className="text-center fw-bold">{product.name}</td>
                <td className="text-center">${product.old_price}</td>
                <td className="text-center text-danger fw-bold">
                  ${product.new_price}
                </td>
                <td className="text-center">{product.category}</td>
                <td className="text-center">
                  <img
                    onClick={() => removeProduct(product.id)}
                    className="listproduct-remove-icon"
                    src={cross_icon}
                    alt=""
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListProduct;
