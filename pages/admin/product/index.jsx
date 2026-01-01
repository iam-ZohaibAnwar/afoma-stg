import ConfirmModal from "@/components/ConfirmModal";
import Layout from "@/components/Layout";
import { PhysicalProductTypeModal } from "@/components/PhysicalProductTypeModal";
import ProductKeywordModal from "@/components/ProductKeywordModal";
import { ProductTypeModal } from "@/components/ProductTypeModal";
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminProductMgmt = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [selectedProductStatus, setSelectedProductStatus] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhysicalModalOpen, setIsPhysicalModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts()
  }, []);

  const fetchProducts = async () => {
    axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    })
    .then((res) => {
      setPersons(res.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const onViewClick = (id, productType) => {
    let url;
    if (productType === "Standard") {
      url = `/admin/product/standard-product/${id}`;
    } else if (productType === "Downloadable") {
      url = `/admin/product/downloadable-product/${id}`;
    } else if (productType === "Customizable") {
      url = `/admin/product/customizable-product/${id}`;
    } else {
      console.error("Something went wrong");
    }
    router.push(url);
  };

  const handleDelete = (id) => {
    setDeleteProductLoading(true);
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`)
      .then(() => {
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person._id !== id)
        );
        setDeleteProductLoading(false);
        toast.success("Product deleted successfully");
      })
      .catch((error) => {
        setDeleteProductLoading(false);
        toast.error("Something went wrong");
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = persons.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };
  const onpreViewClick = (slug) => {
    router.push(`/preview/${slug}`);
  };

  useEffect(() => {
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);

  const handleProductStatusFilter = (status) => {
    if(status == "Active" || status == "Inactive"){
      setProductStatus(status)
      setSelectedProductStatus("");
    }else{
      setSelectedProductStatus(status);
      setProductStatus("")
    }
  };

  const filterProductsByStatus = (products, status, prodStatus) => {
    if (!status && !prodStatus) return products;
    if(status){
      return products.filter((product) => product.productStatus === status);
    }
    if(prodStatus){
      const filterStatus = prodStatus === "Active" ? 1 : 0
      return products.filter((product) => product.status == filterStatus);
    }
  };

  const visiblePersons = Array.isArray(persons)
    ? filterProductsByStatus(
        persons.filter((product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        selectedProductStatus,
        productStatus
      ).slice(startIndex, endIndex)
    : [];

  // For Delete Confirm Modal
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(undefined);

  // For Prompt Modal
  const [isKeywordModalOpen, setKeywordModalOpen] = useState(false);
  const [selectedHrefLink, setSelectedHrefLink] = useState("");

  const onEditClick = (id, productType) => {
    let url;
    if (productType === "Standard") {
      url = `/admin/product/standard-product?id=${id}`;
    } else if (productType === "Downloadable") {
      url = `/admin/product/downloadable-product?id=${id}`;
    } else if (productType === "Customizable") {
      url = `/admin/product/customizable-product?id=${id}`;
    } else {
      console.error("Something went wrong");
    }
    router.push(url);
  };

  const onDuplicateProduct = (prod) => {
    setLoading(true);
    delete prod._id;
    delete prod.createdAt;
    delete prod.updatedAt;
    delete prod.downloadableLink;
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
        {
          ...prod,
          Category: prod.Category ? prod.Category._id : null,
          SubCategory: prod.SubCategory ? prod.SubCategory._id : null,
          childCategory: prod.childCategory ? prod.childCategory._id : null,
          seller: prod.seller ? prod.seller._id : null,
          productStatus: "Draft",
          images: [],
          videos: [],
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then(function (response) {
        setLoading(false);
        if (response && response.data && response.data.newProduct) {
          toast.success("New Product duplicated successfully");
          onEditClick(
            response.data.newProduct._id,
            response.data.newProduct.productType
          );
        }
      })
      .catch(function (response) {
        setLoading(false);
        const newError = response.response.data;
        const errorMessage = JSON.stringify(newError);
        toast.error(errorMessage);
      });
  };

  const updateProductStatus = (status) => {
    axios
    .post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/update-status`,
      {
        status: status == "active" ? 1 : 0,
        ids: selectedIds
      },
      {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      }
    )
    .then(function (response) {
      console.log(response)
      setLoading(false);
      if (response && response.status == 200) {
        setSelectAll(false)
        setSelectedIds([])
        setLoading(true)
        fetchProducts()
        toast.success("Products updated successfully");
      }
    })
    .catch(function (response) {
      setLoading(false);
      const newError = response.response.data;
      const errorMessage = JSON.stringify(newError);
      toast.error(errorMessage);
    });
  }

  const handleProductTypeSelection = (type) => {
    console.log('Selected Product Type:', type); // You can handle navigation or form state here
    setIsModalOpen(false);
    if (type == "Digital Product") {
      setKeywordModalOpen(true);
      setSelectedHrefLink("/admin/product/downloadable-product");
      return
    }
    setIsPhysicalModalOpen(true)
  };

  const handlePhysicalProductTypeSelection = (type) => {
    console.log('Selected Product Type:', type); // You can handle navigation or form state here
    setIsModalOpen(false);
    setIsPhysicalModalOpen(false)
    if (type == "Standard Product") {
      setKeywordModalOpen(true);
      setSelectedHrefLink(
        "/admin/product/standard-product"
      );
    } else if (type == "Customizable Product") {
      setKeywordModalOpen(true);
      setSelectedHrefLink(
        "/admin/product/customizable-product"
      );
    }
  };

  return (
    <>
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans"
        />
        <meta
          property="og:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta
          name="description"
          content="Join AFOMA Marketplace - a unique platform for artists and artisans to sell crafts globally. Be first for exclusive deals and promotions."
        ></meta>
      </Head>

      <Layout userType="admin">
        <>
          <div className="xl:flex justify-between items-center">
            <h1
              className={`md:text-2xl text-lg text-blue-950 font-medium mb-2 noto-font `}
            >
              Product Information
            </h1>
            <div className="flex md:flex-row flex-col items-center justify-end gap-4 shrink-0">
              <div
                className={`flex items-center border border-zinc-200 rounded-[3px] md:w-auto w-full`}
              >
                <div className="bg-primary p-3 rounded-tl-[3px] rounded-bl-[3px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.732"
                    height="17.732"
                    viewBox="0 0 17.732 17.732"
                  >
                    <path
                      id="magnifying-glass-light"
                      d="M16.578,15.84l-4.624-4.624A6.815,6.815,0,0,0,6.768,0a6.8,6.8,0,1,0,4.418,11.956L15.81,16.58a.659.659,0,0,0,.4.152.523.523,0,0,0,.369-.892ZM6.8,12.549A5.752,5.752,0,1,1,12.549,6.8,5.741,5.741,0,0,1,6.8,12.549Z"
                      transform="translate(0.5 0.5)"
                      fill="#fff"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full border-none p-2 border-zinc-200 focus:ring-zinc-200 focus:border-zinc-200 outline-none"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex items-center justify-center rounded-full">
                      <p className="dashboard-button-secondary">
                        Product Status{" "}
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="h-4 w-8 fill-blue-950"
                        />
                      </p>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                      <div className="py-2">
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleProductStatusFilter("")}
                          >
                            All
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() =>
                              handleProductStatusFilter("Approved")
                            }
                          >
                            Approved
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleProductStatusFilter("Pending")}
                          >
                            Pending
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleProductStatusFilter("Review")}
                          >
                            Review
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() =>
                              handleProductStatusFilter("Disapproved")
                            }
                          >
                            Disapproved
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleProductStatusFilter("Draft")}
                          >
                            Draft
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleProductStatusFilter("Active")}
                          >
                            Active
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleProductStatusFilter("Inactive")}
                          >
                            Inactive
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex items-center justify-center rounded-full">
                      <p className="dashboard-button-primary">
                        Add/Modify Product{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="9.211"
                          height="5.411"
                          viewBox="0 0 9.211 5.411"
                        >
                          <path
                            d="M24.23,44.615a.383.383,0,0,1-.272-.113l-3.846-3.846a.385.385,0,0,1,.544-.544l3.574,3.574L27.8,40.112a.385.385,0,1,1,.544.544L24.5,44.5a.383.383,0,0,1-.272.113Z"
                            transform="translate(-19.625 -39.579)"
                            fill="#fff"
                            stroke="#fff"
                            strokeWidth="0.75"
                          />
                        </svg>
                      </p>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                      <div className="py-2">
                        <Menu.Item>
                          <div
                            onClick={() => {
                              setIsModalOpen(true);
                              // setKeywordModalOpen(true);
                              // setSelectedHrefLink(
                              //   "/admin/product/standard-product"
                              // );
                            }}
                            className="hover:bg-orange-100 cursor-pointer text-blue-950 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2"
                          >
                            Add Product
                          </div>
                        </Menu.Item>
                        {/* <Menu.Item>
                          <div
                            onClick={() => {
                              setKeywordModalOpen(true);
                              setSelectedHrefLink(
                                "/admin/product/standard-product"
                              );
                            }}
                            className="hover:bg-orange-100 cursor-pointer text-blue-950 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2"
                          >
                            Standard
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            onClick={() => {
                              setKeywordModalOpen(true);
                              setSelectedHrefLink(
                                "/admin/product/customizable-product"
                              );
                            }}
                            className="hover:bg-orange-100 cursor-pointer text-blue-950 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2"
                          >
                            Customizable
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            onClick={() => {
                              setKeywordModalOpen(true);
                              setSelectedHrefLink(
                                "/admin/product/downloadable-product"
                              );
                            }}
                            className="hover:bg-orange-100 cursor-pointer text-blue-950 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2"
                          >
                            Downloadable
                          </div>
                        </Menu.Item> */}
                        <Menu.Item>
                          <div
                            onClick={() => {
                              setKeywordModalOpen(true);
                              updateProductStatus('active')
                            }}
                            className="hover:bg-orange-100 cursor-pointer text-blue-950 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2"
                          >
                            Enable Product(s)
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div
                            onClick={() => {
                              setKeywordModalOpen(true);
                              updateProductStatus('inactive')
                            }}
                            className="hover:bg-orange-100 cursor-pointer text-blue-950 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2"
                          >
                             Disable Product(s)
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <>
            <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-8">
              <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
                <thead className="text-left text-sm font-bold text-orange-50 bg-blue-950 h-14">
                  <tr>
                    <th className="px-5 w-[60px]">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => {
                          setSelectAll(e.target.checked);
                          if (e.target.checked) {
                            const allIds = persons.map((item) => item._id); // assuming each row has a unique `id`
                            setSelectedIds(allIds);
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>   
                    <th className="px-5 w-[80px]">Action</th>
                    <th className="px-5 w-[80px]">Status</th> 
                    <th className="px-5 w-[140px]">Product Status</th>
                    <th className="pl-7 py-5 pr-4 w-[180px]">Product Name</th>
                    <th className=" px-5 w-[130px]">Price</th>
                    <th className=" px-5 w-[150px]">Product Type</th>
                    <th className=" px-5 w-[130px]">Seller ID</th>
                    <th className=" px-5 w-[130px]">Seller Name</th>
                    <th className=" px-5 w-[230px]">Product Category</th>
                    {/* <th className=" px-5">Views</th> */}
                  </tr>
                </thead>
                <tbody className="parent">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="pl-9 py-9 font-medium text-blue-950 text-sm"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : visiblePersons.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="pl-9 py-9 font-medium text-blue-950 text-sm "
                      >
                        {searchQuery
                          ? "No products found for the search query!"
                          : "No products added. Start building your inventory!"}
                      </td>
                    </tr>
                  ) : (
                    filterProductsByStatus(
                      visiblePersons,
                      selectedProductStatus,
                      productStatus
                    ).map((admin, index) => (
                      <tr key={index} className="child">
                        {/* <td className="px-5">
                          <button
                            disabled={deleteProductLoading}
                            className="underline text-blue-950 hover:text-primary disabled:opacity-50"
                            onClick={() =>
                              onEditClick(admin._id, admin.productType)
                            }
                          >
                            Edit
                          </button>{" "}
                          <button
                            disabled={deleteProductLoading}
                            className="underline text-blue-950 hover:text-primary disabled:opacity-50"
                            onClick={() => {
                              setSelectedProduct(admin);
                              setIsConfirmModalOpen(true);
                            }}
                          >
                            Delete
                          </button>
                          <br />
                          <button
                            disabled={deleteProductLoading}
                            className="underline text-blue-950 hover:text-primary disabled:opacity-50"
                            onClick={() =>
                              onViewClick(admin._id, admin.productType)
                            }
                          >
                            View
                          </button>{" "}
                          <button
                            disabled={deleteProductLoading}
                            type="button"
                            className="underline text-blue-950 hover:text-primary disabled:opacity-50"
                            onClick={() => onpreViewClick(admin?.slug)}
                          >
                            Preview
                          </button>
                        </td> */}
                        <td className="px-5 w-[60px]">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(admin._id)}
                            onChange={() => {
                              const alreadySelected = selectedIds.includes(admin._id);
                              const updated = alreadySelected
                                ? selectedIds.filter((id) => id !== admin._id)
                                : [...selectedIds, admin._id];
                              setSelectedIds(updated);
                              setSelectAll(updated.length === persons.length);
                            }}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <Menu.Button
                              disabled={loading}
                              className="items-center bg-primary rounded-[4px] w-[26px] h-[28px] flex justify-center text-white hover:text-gray-300 disabled:opacity-50"
                            >
                              <span className="sr-only">Open options</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={4}
                                  d="M12 6v.01M12 12v.01M12 18v.01"
                                />
                              </svg>
                            </Menu.Button>
                            <Menu.Items
                              ref={menuRef}
                              className="z-[99] top-[-30px] absolute mt-2 left-full w-28 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() =>
                                        onEditClick(
                                          admin._id,
                                          admin.productType
                                        )
                                      }
                                      disabled={loading}
                                      className={`${
                                        active ? "bg-gray-100" : ""
                                      } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                    >
                                      Edit
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => {
                                        setSelectedProduct(admin);
                                        setIsConfirmModalOpen(true);
                                      }}
                                      disabled={loading}
                                      className={`${
                                        active ? "bg-gray-100" : ""
                                      } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() =>
                                        onViewClick(
                                          admin._id,
                                          admin.productType
                                        )
                                      }
                                      disabled={loading}
                                      className={`${
                                        active ? "bg-gray-100" : ""
                                      } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                    >
                                      View
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => onpreViewClick(admin.slug)}
                                      disabled={loading}
                                      className={`${
                                        active ? "bg-gray-100" : ""
                                      } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                    >
                                      Preview
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => onDuplicateProduct(admin)}
                                      disabled={loading}
                                      className={`${
                                        active ? "bg-gray-100" : ""
                                      } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                    >
                                      Duplicate
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Menu>
                        </td>
                        <td
                          className={`font-semibold px-5 ${
                            admin.status == 1
                              ? "text-green-800"
                              : admin.status == 0
                              ? "text-red-800"
                              : "text-gray-800"
                          }`}
                        >
                           {admin.status === 1 ? "Active" : admin.status === 0 ? "Inactive" : ""}
                        </td>
                        <td
                          className={`font-semibold px-5 ${
                            admin.productStatus === "Approved"
                              ? "text-green-800"
                              : admin.productStatus === "Disapproved"
                              ? "text-red-800"
                              : admin.productStatus === "Review"
                              ? "text-yellow-600 "
                              : "text-gray-800"
                          }`}
                        >
                          {admin.productStatus}
                        </td>
                        <td className="px-5 pl-7 py-2 text-blue-950 pr-5">
                          {admin.productName}
                        </td>
                        <td className="text-blue-950 px-5">
                          {admin?.productType === "Customizable"
                            ? admin?.variations[0]?.price
                              ? `CA$${parseFloat(
                                  admin?.variations[0]?.price
                                ).toFixed(2)}`
                              : "-"
                            : admin?.finalPrice
                            ? `CA$${parseFloat(admin?.finalPrice).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="text-blue-950 px-5">
                          {admin?.productType}
                        </td>
                        <td className="text-blue-950 px-5">
                          {admin?.seller?.uuid}
                        </td>
                        <td className="text-blue-950 px-5">
                          {admin?.seller?.firstName}
                        </td>
                        <td className="text-blue-950 pr-5 px-5">
                          {admin?.Category?.name}
                        </td>
                        {/* <td className="text-blue-950">800</td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {visiblePersons && visiblePersons.length > 0 && (
              <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9">
                <div className="">
                  <button
                    className={`flex gap-2 items-center text-gray-500  ${
                      currentPage === 1
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-primary"
                    }`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />{" "}
                    Previous
                  </button>
                </div>

                <div>
                  <div className="">
                    <button
                      className={`flex gap-2 items-center text-gray-500  ${
                        currentPage === Math.ceil(totalItems / itemsPerPage)
                          ? "cursor-not-allowed opacity-50"
                          : "hover:text-primary"
                      }`}
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={
                        currentPage === Math.ceil(totalItems / itemsPerPage)
                      }
                    >
                      Next
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="h-[8px]"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        </>
      </Layout>
      {/* Pass dynamic props to the ConfirmModal */}
      <ProductTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProductType={handleProductTypeSelection}
      />
      <PhysicalProductTypeModal
        isOpen={isPhysicalModalOpen}
        onClose={() => setIsPhysicalModalOpen(false)}
        onSelectProductType={handlePhysicalProductTypeSelection}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen && selectedProduct}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          handleDelete(selectedProduct._id);
        }}
        header="Delete Product"
        message="Are you sure you want to delete this product?"
        confirmText="Yes, Delete"
        bgClass="bg-red-500"
      />
      <ProductKeywordModal
        hrefLink={selectedHrefLink}
        isOpen={isKeywordModalOpen && selectedHrefLink}
        onClose={() => {
          setKeywordModalOpen(false);
        }}
        onConfirm={(data) => {
          setKeywordModalOpen(false);
          if (data && data.hrefLink && data.keywords) {
            router.push(`${data.hrefLink}?keywords=${data.keywords}`);
            setSelectedHrefLink("");
          }
        }}
        onSkip={() => {
          setKeywordModalOpen(false);
          router.push(selectedHrefLink);
          setSelectedHrefLink("");
        }}
      />
    </>
  );
};

export default AdminProductMgmt;
