import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBagShopping,
  faBoxTaped,
  faChartSimple,
  faChartTreeMap,
  faCircleDollar,
  faCircleUser,
  faDiagramSubtask,
  faFilePen,
  faGear,
  faObjectsColumn,
  faStar,
  faStore,
  faTruck,
  faUserCircle,
  faUserDoctor,
} from "@fortawesome/pro-light-svg-icons";

const Sidebar = () => {
  const router = useRouter();
  const path = router.pathname;

  return (
    <>
      <div className="bg-orange-100 h-full   relative w-[337px]">
        <div className=" bg-orange-100 p-9 2xl:py-9 2xl:pl-20 2xl:pr-12">
          <h1 className="mb-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="209.353"
              height="41.999"
              viewBox="0 0 209.353 41.999"
            >
              <g transform="translate(0.01 -0.003)">
                <g transform="translate(-0.01 0.003)">
                  <path
                    d="M1372.608,945.864a.737.737,0,0,0,.746.643h.164v.1H1371.3v-.1h.153a.412.412,0,0,0,.4-.429l-.46-5.134-2.144,4.767a5,5,0,0,0-.347,1.042h-.1l-2.614-5.666-.439,4.992a.412.412,0,0,0,.4.429h.153v.1h-1.98v-.1h.163a.722.722,0,0,0,.745-.643l.775-6.544h.092l2.849,6.157,2.787-6.157h.092l.786,6.544Zm100.091.745h-4.144v-.1h.143a.578.578,0,0,0,.592-.541v-4.849a.549.549,0,0,0-.592-.531h-.143v-.1h2.981a4.209,4.209,0,0,0,1.143-.164v1.154h-.113v-.153a.5.5,0,0,0-.51-.521h-2.113v2.594h1.735a.4.4,0,0,0,.418-.439v-.123h.113v1.43h-.113v-.134a.391.391,0,0,0-.387-.429h-1.766v2.594h1.592a1.592,1.592,0,0,0,1.623-1.154h.1l-.562,1.47Zm-8.942-2.573-.113,1.4a3.306,3.306,0,0,1-2.807,1.317,3.209,3.209,0,1,1,0-6.411,4.917,4.917,0,0,1,2.389.613l.224,1.45h-.092a2.3,2.3,0,0,0-2.532-1.756c-1.613,0-2.624,1.1-2.624,2.9a2.589,2.589,0,0,0,2.635,2.89,2.5,2.5,0,0,0,2.827-2.4h.092Zm-12.771.194-1.144-2.8-1.184,2.8Zm1.469,1.685a.937.937,0,0,0,.8.592h.072v.1h-2.093v-.1h.082a.422.422,0,0,0,.357-.613l-.562-1.358h-2.583l-.562,1.328a.428.428,0,0,0,.358.643h.082v.1h-1.949v-.1h.081a.924.924,0,0,0,.8-.592l2.113-4.523a5.457,5.457,0,0,0,.4-1.051h.092l2.521,5.574Zm-9.982-.776-.571,1.47h-4.145v-.1h.143a.578.578,0,0,0,.592-.541v-4.828a.592.592,0,0,0-.613-.552h-.123v-.1h2.114v.1h-.123a.581.581,0,0,0-.6.552v5.155h1.592a1.591,1.591,0,0,0,1.623-1.153h.113Zm-11.81-4.655c1.419,0,2.328.664,2.328,1.746a1.909,1.909,0,0,1-2.94,1.582v-.1a1.761,1.761,0,0,0,2.133-1.031,1.9,1.9,0,0,0,.071-.552c0-.827-.612-1.337-1.613-1.337h-.981v5.165a.566.566,0,0,0,.592.552h.134l.009.1h-2.123v-.1h.143a.576.576,0,0,0,.592-.541v-4.839a.563.563,0,0,0-.592-.541h-.143v-.1h2.389Zm-8.074-.01a4.282,4.282,0,0,0,1.144-.164v1.153h-.113V941.3a.5.5,0,0,0-.51-.521h-1.848v5.186a.587.587,0,0,0,.6.541h.112v.1h-2.1l.009-.1H1420a.588.588,0,0,0,.6-.552V940.78h-1.848a.5.5,0,0,0-.51.521v.163h-.113V940.31a4.192,4.192,0,0,0,1.133.164h3.328Zm-9.319,6.135h-4.144v-.1h.143a.578.578,0,0,0,.592-.541v-4.849a.55.55,0,0,0-.592-.531h-.143v-.1h2.981a4.209,4.209,0,0,0,1.143-.164v1.154h-.113v-.153a.5.5,0,0,0-.51-.521h-2.114v2.594h1.736a.4.4,0,0,0,.419-.439v-.123h.112v1.43h-.112v-.134a.391.391,0,0,0-.388-.429h-1.766v2.594h1.594a1.593,1.593,0,0,0,1.623-1.154h.1Zm-9.381-.521a1.041,1.041,0,0,0,.889.419v.1h-.378a1.947,1.947,0,0,1-1.5-.582l-2.246-2.46,2.2-2.582c.153-.184.02-.4-.224-.4h-.082v-.1h2.072v.1h-.041a1.363,1.363,0,0,0-.99.368l-2.225,2.379,2.531,2.756Zm-3.593-.132a.587.587,0,0,0,.6.551h.113v.1h-2.093v-.1h.123a.587.587,0,0,0,.6-.551v-4.818a.587.587,0,0,0-.6-.551h-.123v-.1h2.093v.1h-.113a.578.578,0,0,0-.6.531Zm-9.055-5.472c1.287,0,2.073.623,2.073,1.654a1.716,1.716,0,0,1-1.583,1.684,2.9,2.9,0,0,1,.786.8,14.064,14.064,0,0,0,.888,1.113c.418.47.7.766,1.266.776v.1h-.317a2.156,2.156,0,0,1-1.9-.9c-.112-.142-.918-1.3-1-1.4a1.489,1.489,0,0,0-1.03-.684v-.1s.245.01.582,0c.561-.01,1.2-.021,1.5-.878a1.588,1.588,0,0,0,.071-.583,1.256,1.256,0,0,0-1.357-1.256c-.572-.031-1.073,0-1.174-.01v5.155a.569.569,0,0,0,.581.552h.133l.01.1h-2.093v-.1h.142a.582.582,0,0,0,.583-.541v-4.849a.553.553,0,0,0-.583-.531h-.142v-.1h2.562Zm-9.249,3.747-1.144-2.8-1.184,2.8Zm1.469,1.685a.936.936,0,0,0,.8.592h.072v.1h-2.093v-.1h.082a.422.422,0,0,0,.357-.613l-.561-1.358h-2.583l-.562,1.328c-.153.408.112.643.357.643h.082v.1h-1.95v-.1h.082a.923.923,0,0,0,.8-.592l2.113-4.523a5.415,5.415,0,0,0,.4-1.051h.092l2.521,5.574Z"
                    transform="translate(-1314.113 -904.754)"
                    fill="#232323"
                  />
                  <path
                    d="M149.993,11.022l1.418,1.417L149.993,13.9l-1.417-1.465,1.417-1.417ZM93.219,20.946A9.574,9.574,0,0,1,92.5,8.31l-.252-.255A9.913,9.913,0,0,0,106.1,22.043l-.252-.255a9.574,9.574,0,0,1-12.63-.842Zm13.469-14.07A9.932,9.932,0,0,0,93.923,6.4l.253.255a9.575,9.575,0,0,1,12.265.482l-2.2,2.278c-2.534-1.551-5.3-2.443-7.957-.485h0A5.087,5.087,0,0,0,94.5,14.508c.044.146.093.291.148.432a.164.164,0,0,0,.209.042.16.16,0,0,0,.073-.163,3.586,3.586,0,0,1-.152-.385A4.732,4.732,0,0,1,96.46,9.163c2.5-1.838,5.139-1.007,7.575.47l-.4.422a1.612,1.612,0,1,0,.574.6l.567-.543c.853.564,1.674,1.186,2.449,1.773q.68.5,1.294.965c.34.245.685.47,1.031.674a9.568,9.568,0,0,1-2.024,6.61l.253.255a9.915,9.915,0,0,0,2.14-6.656,11.6,11.6,0,0,0,1.549.707,11.456,11.456,0,1,1-4.051-8.95,14.229,14.229,0,0,0-.721,1.385l0,0Zm.431.936a9.5,9.5,0,0,1,2.394,5.338c-.291-.176-.569-.359-.827-.545-.413-.3-.839-.623-1.291-.964-.761-.578-1.57-1.187-2.409-1.747l2.134-2.081Zm2.772,5.558a9.862,9.862,0,0,0-2.518-5.806l.094-.092h0a12.1,12.1,0,0,0,1.271-.663,11.393,11.393,0,0,1,2.728,7.3,11.919,11.919,0,0,1-1.575-.737Zm9.14-1.986a4.909,4.909,0,0,1-3.194,3.11,6.491,6.491,0,0,1-3.543-.112c0-.055,0-.11,0-.164a12.218,12.218,0,0,0-2.858-7.863,12.154,12.154,0,0,0,1.77-1.507c.057-.059.611-.644,1.207-1.39a7.137,7.137,0,0,1,5.5,1.933A5.286,5.286,0,0,1,119.032,11.384ZM109.685,3.41C111.616,1.375,113.1.5,113.436.561c.058.26-.425,1.267-1.574,2.671a7.294,7.294,0,0,0-1.8.493.145.145,0,0,0-.082.192.148.148,0,0,0,.193.078,7.212,7.212,0,0,1,1.4-.42c-.239.271-.5.574-.792.88a11.7,11.7,0,0,1-1.728,1.46q-.36-.392-.754-.752a13.762,13.762,0,0,1,1.383-1.753Zm-1.341,2.959q-.5.294-1.028.538.248-.525.539-1.026Q108.107,6.118,108.344,6.369Zm9.783-1.179a7.418,7.418,0,0,0-5.462-2.022c.876-1.134,1.725-2.51,1.182-3.02-.967-.9-4.438,2.721-4.586,2.876a14.229,14.229,0,0,0-1.4,1.756,12.268,12.268,0,1,0,4.426,9.921,6.788,6.788,0,0,0,3.632.082A5.183,5.183,0,0,0,119.3,11.5a5.558,5.558,0,0,0-1.176-6.312Zm-14.789,5.17c-.592.615-1.293,1.34-1.592,1.65a1.2,1.2,0,0,1,1.592-1.65Zm-1.073,2.148,1.632-1.561a1.2,1.2,0,0,1-1.632,1.561Zm-7.608,7.034.233.011,1.347-1.284a1.615,1.615,0,1,0-.2-.19l-1.378,1.462Zm1.879-1.558,1.707-1.628a1.2,1.2,0,0,1-1.707,1.628Zm1.417-1.938L96.317,17.78a1.2,1.2,0,0,1,1.635-1.735Zm4.847,2.169A1.209,1.209,0,0,1,101.7,16.48l.1-.22.864.865a.193.193,0,0,0,.253,0,.178.178,0,0,0,0-.25l-.863-.863.216-.105a1.2,1.2,0,0,1,.521-.122,1.215,1.215,0,0,1,0,2.429Zm-4.474-6.262h0l-.1.219-.864-.865a.18.18,0,0,0-.251,0,.178.178,0,0,0,0,.251l.864.863-.218.1a1.2,1.2,0,0,1-.521.12,1.214,1.214,0,1,1,1.214-1.214,1.2,1.2,0,0,1-.121.519ZM102.8,15.43a1.56,1.56,0,0,0-.864.261l-.117.076-.05-.049-3.307-3.307.077-.117a1.546,1.546,0,0,0,.262-.863A1.57,1.57,0,1,0,97.232,13a1.553,1.553,0,0,0,.863-.262l.115-.077.1.1,3.256,3.258-.076.116a1.568,1.568,0,1,0,1.308-.7Zm-93.365-4.2h3.052v-.972H9.434Zm0,4.887h3.052v-.972H9.434ZM10.96,13.4l-.1-.1.1-.1.1.1Zm1.392-.127L10.96,11.88,9.539,13.3l1.416,1.417,1.125-1.083.272-.363ZM4.99,17.257l5.97-13.316L16.9,17.257ZM10.96,1.624-.01,26.17l.853.379,3.742-8.32h12.75l3.742,8.32.852-.379ZM48.469,24.175V2.065h15.8V3H49.441V24.175l.95.99-1.457,1.41-1.413-1.414Zm3.5-11.773h.939v3.052h-.939Zm-1.354,0h.973v3.052h-.973Zm3.368,1.057h7.445V14.4H53.983v-.938ZM149.992,19.9l11.7-18.581V26.452h-.939V4.612L149.992,21.7,139.234,4.612V26.452H138.3V1.315l11.7,18.581Zm1.526-4.9h-3.052v-.938h3.052Zm0,1.353h-3.052v-.938h3.052Zm45.329-5.118H199.9v-.972h-3.052Zm0,4.887H199.9v-.972h-3.052Zm1.525-2.716-.1-.1.1-.1.1.1Zm1.393-.127-1.393-1.392-1.421,1.42,1.417,1.417,1.125-1.083.272-.363ZM192.4,17.257l5.969-13.316,5.938,13.316Zm5.97-15.633L187.4,26.17l.853.379L192,18.229h12.75l3.743,8.32.853-.379L198.373,1.624Z"
                    transform="translate(0.01 -0.003)"
                    fillRule="evenodd"
                  />
                </g>
              </g>
            </svg>
          </h1>
          <div>
            <ul className="text-slate-400 text-sm font-medium ">
              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/dashboard")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faObjectsColumn} className="h-5 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21.464"
                height="21.464"
                viewBox="0 0 21.464 21.464"
              

              >
                <path
                  d="M8.273,7.155H1.565A1.567,1.567,0,0,1,0,5.59V1.565A1.567,1.567,0,0,1,1.565,0H8.273A1.567,1.567,0,0,1,9.838,1.565V5.59A1.567,1.567,0,0,1,8.273,7.155ZM1.565,1.342a.224.224,0,0,0-.224.224V5.59a.224.224,0,0,0,.224.224H8.273A.224.224,0,0,0,8.5,5.59V1.565a.224.224,0,0,0-.224-.224Zm0,0"
                  transform="translate(0 0)"
                  fill="#172554"
                  
                 

                />
                <path
                  d="M8.273,225.853H1.565A1.567,1.567,0,0,1,0,224.288V214.9a1.567,1.567,0,0,1,1.565-1.565H8.273A1.567,1.567,0,0,1,9.838,214.9v9.391A1.567,1.567,0,0,1,8.273,225.853ZM1.565,214.674a.224.224,0,0,0-.224.224v9.391a.224.224,0,0,0,.224.224H8.273a.224.224,0,0,0,.224-.224V214.9a.224.224,0,0,0-.224-.224Zm0,0"
                  transform="translate(0 -204.389)"
                  fill="#172554"
              

                />
                <path
                  d="M285.6,348.487H278.9a1.567,1.567,0,0,1-1.565-1.565V342.9a1.567,1.567,0,0,1,1.565-1.565H285.6a1.567,1.567,0,0,1,1.565,1.565v4.025A1.567,1.567,0,0,1,285.6,348.487Zm-6.708-5.813a.224.224,0,0,0-.224.224v4.025a.224.224,0,0,0,.224.224H285.6a.224.224,0,0,0,.224-.224V342.9a.224.224,0,0,0-.224-.224Zm0,0"
                  transform="translate(-265.706 -327.023)"
                  fill="#172554"
                 

                />
                <path
                  d="M285.6,12.521H278.9a1.567,1.567,0,0,1-1.565-1.565V1.565A1.567,1.567,0,0,1,278.9,0H285.6a1.567,1.567,0,0,1,1.565,1.565v9.391A1.567,1.567,0,0,1,285.6,12.521ZM278.9,1.342a.224.224,0,0,0-.224.224v9.391a.224.224,0,0,0,.224.224H285.6a.224.224,0,0,0,.224-.224V1.565a.224.224,0,0,0-.224-.224Zm0,0"
                  transform="translate(-265.706 0)"
                  fill="#172554"
                

                />
              </svg> */}

                <Link href="/dashboard" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Dashboard
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/sellermanagement")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faStore} className="h-5 w-4" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17.675"
                height="21.464"
                viewBox="0 0 17.675 21.464"
              >
                <g transform="translate(-7 -1)">
                  <path d="M23.944,17.06a1.736,1.736,0,0,0,.694-1.768l-.354-1.667a1.717,1.717,0,0,0-1.7-1.263H17.233a1.7,1.7,0,0,0-1.7,1.263l-.328,1.667a1.749,1.749,0,0,0,.694,1.774l-.423,1.957a2.854,2.854,0,0,0,2.752,3.441H21.6a2.86,2.86,0,0,0,2.778-3.441Zm-.9-3.157.354,1.641a.562.562,0,0,1-.4.631.8.8,0,0,1-1.086-.48c-.044-.505-.145-1.559-.2-2.064.3.025,1.25-.145,1.326.284ZM19.19,15.627c0-.2.177-1.894.189-2.014H20.44c.038.4.152,1.6.2,2.014v.044c-.038.745-1.49.72-1.446-.032ZM16.766,13.9c.088-.442,1.029-.253,1.345-.29,0,.063-.183,1.944-.2,2.064a.8.8,0,0,1-1.092.473.562.562,0,0,1-.4-.631Zm6.054,6.7a1.566,1.566,0,0,1-1.225.587H18.231A1.591,1.591,0,0,1,16.684,19.3L17.1,17.49a2.191,2.191,0,0,0,1.471-.5,2.14,2.14,0,0,0,2.734,0,2.178,2.178,0,0,0,1.465.492c.1.871.777,2.38.051,3.131Zm-7.614,1.231a.631.631,0,0,1-.631.631H8.263A1.263,1.263,0,0,1,7,21.2V17.414a6.976,6.976,0,0,1,9.23-6.559.631.631,0,0,1-.391,1.193,5.682,5.682,0,0,0-7.576,5.366V21.2h6.313a.631.631,0,0,1,.631.631ZM13.944,9.838a4.419,4.419,0,0,0,0-8.838A4.419,4.419,0,0,0,13.944,9.838Zm0-7.576a3.157,3.157,0,0,1,0,6.313A3.157,3.157,0,0,1,13.944,2.263Z" />
                </g>
              </svg> */}
                <Link href="/sellermanagement" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Seller Management
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/orders")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faBagShopping} className="h-5 w-4.5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19.033"
                height="21.4"
                viewBox="0 0 19.033 21.4"
              >
                <path
                  d="M30.256,16.765a.5.5,0,0,0-.5-.438H26.977V15.32a4.16,4.16,0,0,0-8.319,0v1.007h-2.78a.5.5,0,0,0-.5.438L13.506,30.936a.5.5,0,0,0,.131.408c.212.227.443.458.695.685a.5.5,0,0,0,.337.131h16.3a.5.5,0,0,0,.337-.131A8.162,8.162,0,0,0,32,31.344a.5.5,0,0,0,.131-.408ZM19.68,15.31a3.153,3.153,0,0,1,6.305,0v1.007h-6.32ZM30.759,31.153H14.866l-.332-.322,1.783-13.5h13l1.783,13.5Z"
                  transform="translate(-13.301 -10.96)"
                  fill="#172554"
                  stroke="#172554"
                  strokeWidth="0.4"
                />
              </svg> */}
                <Link href="/orders" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Orders
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/myaccount")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24.293"
                height="24.293"
                viewBox="0 0 24.293 24.293"
              >
                <path
                  d="M18.493,18.179A5.826,5.826,0,0,0,13.1,14.558H10.191A5.826,5.826,0,0,0,4.8,18.179a9.463,9.463,0,1,1,13.694,0Zm-1.824,1.488a9.475,9.475,0,0,1-10.05,0,3.642,3.642,0,0,1,3.571-2.925H13.1a3.642,3.642,0,0,1,3.571,2.925Zm-5.023,3.626A11.646,11.646,0,1,0,0,11.646,11.646,11.646,0,0,0,11.646,23.293Zm0-12.374a1.82,1.82,0,1,1,1.82-1.82A1.82,1.82,0,0,1,11.646,10.919Zm-4-1.82a4,4,0,1,0,4-4A4,4,0,0,0,7.643,9.1Z"
                  transform="translate(0.5 0.5)"
                  fill="#172554"
                  stroke="#ffedd5"
                  strokeWidth="1"
                />
              </svg> */}
                <Link href="/myaccount" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    My Account
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/ordermanagement")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faBagShopping} className="h-5 w-4.5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19.033"
                height="21.4"
                viewBox="0 0 19.033 21.4"
              >
                <path
                  d="M30.256,16.765a.5.5,0,0,0-.5-.438H26.977V15.32a4.16,4.16,0,0,0-8.319,0v1.007h-2.78a.5.5,0,0,0-.5.438L13.506,30.936a.5.5,0,0,0,.131.408c.212.227.443.458.695.685a.5.5,0,0,0,.337.131h16.3a.5.5,0,0,0,.337-.131A8.162,8.162,0,0,0,32,31.344a.5.5,0,0,0,.131-.408ZM19.68,15.31a3.153,3.153,0,0,1,6.305,0v1.007h-6.32ZM30.759,31.153H14.866l-.332-.322,1.783-13.5h13l1.783,13.5Z"
                  transform="translate(-13.301 -10.96)"
                  fill="#172554"
                  stroke="#172554"
                  strokeWidth="0.4"
                />
              </svg> */}
                <Link href="/ordermanagement" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Order Management
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/seller/product-management")
                    ? "text-primary bg-orange-50 "
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faBoxTaped} className="h-5 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21.465"
                height="21.465"
                viewBox="0 0 21.465 21.465"
              >
                <path
                  d="M25.2,9.174,14.951,4.052a.489.489,0,0,0-.436,0L4.27,9.174A.488.488,0,0,0,4,9.61V19.855a.488.488,0,0,0,.27.436l10.244,5.122a.489.489,0,0,0,.437,0L25.2,20.291a.488.488,0,0,0,.27-.436V9.61A.488.488,0,0,0,25.2,9.174ZM14.732,5.033,23.886,9.61l-1.958.979L12.774,6.013Zm3.293,7.507L8.871,7.964l2.812-1.406,9.154,4.577Zm.366.908,2.927-1.463v3.629l-.936-.669a.488.488,0,0,0-.685.119l-1.306,1.887ZM7.781,8.509l9.153,4.577-2.2,1.1L5.579,9.61ZM4.976,10.4l9.269,4.634v9.153L4.976,19.553ZM15.22,24.188V15.034l2.2-1.1v4.577a.488.488,0,0,0,.889.278l1.914-2.764,1.3.932a.488.488,0,0,0,.771-.4V11.5l2.2-1.1v9.153Z"
                  transform="translate(-4 -4)"
                  // fill="#1F628E"
                />
              </svg> */}
                <Link href="/seller/product-management">
                  <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                  Product Management
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/categorymanagement")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faChartTreeMap} className="h-4 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19.09"
                height="16.704"
                viewBox="0 0 19.09 16.704"
              >
                <g transform="translate(0 0)">
                  <path
                    d="M2.585,3.977H1.392A1.393,1.393,0,0,1,0,2.585V1.392A1.393,1.393,0,0,1,1.392,0H2.585A1.393,1.393,0,0,1,3.977,1.392V2.585A1.394,1.394,0,0,1,2.585,3.977ZM1.392,1.193a.2.2,0,0,0-.2.2V2.585a.2.2,0,0,0,.2.2H2.585a.2.2,0,0,0,.2-.2V1.392a.2.2,0,0,0-.2-.2Zm0,0"
                    transform="translate(0 0)"
                    fill="#172554"
                  />
                  <path
                    d="M2.585,174.645H1.392A1.393,1.393,0,0,1,0,173.253V172.06a1.393,1.393,0,0,1,1.392-1.392H2.585a1.393,1.393,0,0,1,1.392,1.392v1.193A1.393,1.393,0,0,1,2.585,174.645Zm-1.193-2.784a.2.2,0,0,0-.2.2v1.193a.2.2,0,0,0,.2.2H2.585a.2.2,0,0,0,.2-.2V172.06a.2.2,0,0,0-.2-.2Zm0,0"
                    transform="translate(0 -164.305)"
                    fill="#172554"
                  />
                  <path
                    d="M2.585,345.309H1.392A1.393,1.393,0,0,1,0,343.917v-1.193a1.393,1.393,0,0,1,1.392-1.392H2.585a1.394,1.394,0,0,1,1.392,1.392v1.193A1.393,1.393,0,0,1,2.585,345.309Zm-1.193-2.784a.2.2,0,0,0-.2.2v1.193a.2.2,0,0,0,.2.2H2.585a.2.2,0,0,0,.2-.2v-1.193a.2.2,0,0,0-.2-.2Zm0,0"
                    transform="translate(0 -328.605)"
                    fill="#172554"
                  />
                  <path
                    d="M162.257,38.525H149.929a.6.6,0,0,1,0-1.193h12.329a.6.6,0,0,1,0,1.193Zm0,0"
                    transform="translate(-143.764 -35.94)"
                    fill="#172554"
                  />
                  <path
                    d="M162.257,209.193H149.929a.6.6,0,1,1,0-1.193h12.329a.6.6,0,0,1,0,1.193Zm0,0"
                    transform="translate(-143.764 -200.245)"
                    fill="#172554"
                  />
                  <path
                    d="M162.257,379.861H149.929a.6.6,0,0,1,0-1.193h12.329a.6.6,0,0,1,0,1.193Zm0,0"
                    transform="translate(-143.764 -364.549)"
                    fill="#172554"
                  />
                </g>
              </svg> */}
                <Link href="/categorymanagement" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Category Management
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/usermanagement")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faCircleUser} className="h-5 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="19.939"
                height="19.939"
                viewBox="0 0 19.939 19.939"
              >
                <defs>
                  <clipPath id="a">
                    <path
                      d="M0-682.665H19.939v19.939H0Z"
                      transform="translate(0 682.665)"
                      fill="#172554"
                    />
                  </clipPath>
                </defs>
                <g transform="translate(0 682.665)">
                  <g transform="translate(0 -682.665)">
                    <g transform="translate(0 0)" clipPath="url(#a)">
                      <g transform="translate(0.584 0.584)">
                        <path
                          d="M-623.894-311.947a9.386,9.386,0,0,1-9.385,9.386,9.385,9.385,0,0,1-9.386-9.386,9.385,9.385,0,0,1,9.386-9.386A9.385,9.385,0,0,1-623.894-311.947Z"
                          transform="translate(642.665 321.333)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1.2"
                        />
                      </g>
                      <g transform="translate(6.215 4.964)">
                        <path
                          d="M-249.559-124.778a3.754,3.754,0,0,1-3.754,3.754,3.754,3.754,0,0,1-3.754-3.754,3.754,3.754,0,0,1,3.754-3.754A3.754,3.754,0,0,1-249.559-124.778Z"
                          transform="translate(257.067 128.532)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1.2"
                        />
                      </g>
                      <g transform="translate(4.37 12.473)">
                        <path
                          d="M0-167.18a5.632,5.632,0,0,1,5.6-5.03,5.632,5.632,0,0,1,5.6,5.03"
                          transform="translate(0 172.21)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1.2"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg> */}
                <Link href="/usermanagement" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    User Management
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/contentmanagement")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faFilePen} className="h-5 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20.574"
                height="20.508"
                viewBox="0 0 20.574 20.508"
             
              >
                <g transform="translate(-25.255 -25.993)">
                  <g transform="translate(25.255 25.993)">
                    <path
                      d="M44.976,29.376a1.781,1.781,0,0,0-2.451.593l-.7,1.142h0l-1.414,2.317V29.56a.447.447,0,0,0-.124-.308c-.017-.018-3.119-3.12-3.134-3.134a.254.254,0,0,0-.036-.031.438.438,0,0,0-.2-.087c-.08-.014.619,0-11.222-.007a.446.446,0,0,0-.446.446V46.055a.446.446,0,0,0,.446.446H39.967a.446.446,0,0,0,.446-.446V40.272l3.762-6.162h0l1.394-2.283a1.785,1.785,0,0,0-.593-2.451Zm-1.33,3.889-1.522-.929.232-.381,1.522.929Zm-4.878,7.991-1.522-.929,4.414-7.23,1.522.929ZM37,42.44l-.124-1.294,1.332.813Zm.292-14.925,1.6,1.6h-1.6ZM39.521,45.61H26.147V26.885H36.4V29.56a.446.446,0,0,0,.446.446h2.675v4.882l-3.5,5.735a.445.445,0,0,0-.063.275l.192,2c-.206.125.4.9.736.546l1.964-.783a.446.446,0,0,0,.215-.182l.457-.749Zm5.286-14.247-.465.761-1.522-.929.465-.761a.892.892,0,0,1,1.522.929Z"
                      transform="translate(-25.255 -25.993)"
                      fill="#172554"
                    
                    />
                  </g>
                </g>
              </svg> */}
                <Link href="/contentmanagement" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Content Management
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/shipping")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faTruck} className="h-5 w-6" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="24.999"
                height="24.999"
                viewBox="0 0 24.999 24.999"
              >
                <defs>
                  <clipPath id="a">
                    <path
                      d="M0-682.665H25v25H0Z"
                      transform="translate(0 682.665)"
                      fill="#172554"
                    />
                  </clipPath>
                </defs>
                <g transform="translate(0 682.665)">
                  <g transform="translate(9.874 -664.574)">
                    <path
                      d="M-207.9,0h-7.9"
                      transform="translate(215.803)"
                      fill="none"
                      stroke="#172554"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-miterlimit="10"
                      strokeWidth="1"
                    />
                  </g>
                  <g transform="translate(0 -682.665)">
                    <g clipPath="url(#a)">
                      <g transform="translate(16.627 8.657)">
                        <path
                          d="M-156.835-248.209h1.678V-253.3l-4.2-4.341H-162.8v9.388"
                          transform="translate(162.797 257.643)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1"
                        />
                      </g>
                      <g transform="translate(16.627 12.998)">
                        <path
                          d="M-200.977,0h-7.639"
                          transform="translate(208.617)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1"
                        />
                      </g>
                      <g transform="translate(5.208 15.648)">
                        <path
                          d="M-17.666-17.667a2.293,2.293,0,0,1,3.242,0,2.293,2.293,0,0,1,0,3.242,2.293,2.293,0,0,1-3.242,0A2.293,2.293,0,0,1-17.666-17.667Z"
                          transform="translate(18.338 18.339)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1"
                        />
                      </g>
                      <g transform="translate(17.987 15.648)">
                        <path
                          d="M-17.665-17.667a2.293,2.293,0,0,1,3.242,0,2.293,2.293,0,0,1,0,3.242,2.293,2.293,0,0,1-3.242,0A2.293,2.293,0,0,1-17.665-17.667Z"
                          transform="translate(18.337 18.339)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1"
                        />
                      </g>
                      <g transform="translate(3.045 4.765)">
                        <path
                          d="M0,0V13.319H2.069"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1"
                        />
                      </g>
                      <g transform="translate(3.045 4.765)">
                        <path
                          d="M-357.868-102.559v-3.9h-13.6"
                          transform="translate(371.471 106.457)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1"
                        />
                      </g>
                      <g transform="translate(3.045 4.765)">
                        <path
                          d="M-133.686,0h-5.082"
                          transform="translate(138.768)"
                          fill="none"
                          stroke="#172554"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          strokeWidth="1"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg> */}
                <Link href="/shipping" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Shipping
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/earnings")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faCircleDollar} className="h-[18px]" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21.4"
                height="21.4"
                viewBox="0 0 21.4 21.4"
                
              >
                <g transform="translate(-2.05 -2.05)">
                  <path
                    d="M12.75,23.25a10.5,10.5,0,1,1,10.5-10.5A10.512,10.512,0,0,1,12.75,23.25Zm0-19.385a8.885,8.885,0,1,0,8.885,8.885A8.895,8.895,0,0,0,12.75,3.865Z"
                    transform="translate(0 0)"
                    fill="#172554"
                    stroke="#ffedd5"
                    strokeWidth="0.4"
                  />
                  <path
                    d="M15.16,14.234a2.426,2.426,0,0,0-2.41-2.676H11.673a.808.808,0,1,1,0-1.615h1.889a.808.808,0,0,0,0-1.615h-.543V8.058a.808.808,0,0,0-1.615,0v.3A2.417,2.417,0,0,0,9.263,11a2.522,2.522,0,0,0,2.553,2.17h.934a.808.808,0,1,1,0,1.615H10.866a.808.808,0,1,0,0,1.615H11.4v.269a.808.808,0,0,0,1.615,0v-.306A2.485,2.485,0,0,0,15.16,14.234Z"
                    transform="translate(0.538 0.385)"
                    fill="#172554"
                    stroke="#ffedd5"
                    strokeWidth="0.4"
                  />
                </g>
              </svg> */}
                <Link href="/earnings" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Earnings
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/review")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faStar} className="h-5 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23.503"
                height="22.551"
                viewBox="0 0 23.503 22.551"
              >
                <g transform="translate(-22.411 -22.383)">
                  <path
                    d="M373.2,365.906l-5.925-.86-2.651-5.37a1.373,1.373,0,0,0-2.462,0l-2.649,5.37-5.926.86a1.373,1.373,0,0,0-.761,2.342l4.288,4.179-1.012,5.9a1.373,1.373,0,0,0,1.992,1.447l5.3-2.786,5.3,2.786a1.373,1.373,0,0,0,1.992-1.447l-1.012-5.9,4.287-4.178a1.372,1.372,0,0,0-.761-2.342Zm-5.959,5.057a1.372,1.372,0,0,0-.395,1.215l.664,3.874-3.478-1.828a1.373,1.373,0,0,0-1.278,0l-3.476,1.827.664-3.872a1.373,1.373,0,0,0-.395-1.215l-2.813-2.741,3.887-.564a1.373,1.373,0,0,0,1.034-.752l1.737-3.522,1.739,3.522a1.372,1.372,0,0,0,1.034.752l3.886.564Zm0,0"
                    transform="translate(-329.23 -335.778)"
                    fill="#172554"
                    stroke="#ffedd5"
                    strokeWidth="1.5"
                  />
                </g>
              </svg> */}
                <Link href="/review" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full"></span>
                    Review
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/report")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faChartSimple} className="h-4 w-5" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22.256"
                height="17.904"
                viewBox="0 0 22.256 17.904"
              >
                <g transform="translate(-0.75 -3.75)">
                  <path
                    d="M22.03,19.954V9.076a.725.725,0,0,0-.725-.725H16.954a.725.725,0,0,0-.725.725V19.954h-1.45V4.725A.725.725,0,0,0,14.053,4H9.7a.725.725,0,0,0-.725.725V19.954H7.527V11.977a.725.725,0,0,0-.725-.725H2.45a.725.725,0,0,0-.725.725v7.977a.725.725,0,0,0,0,1.45H22.03a.725.725,0,1,0,0-1.45ZM17.679,9.8h2.9V19.954h-2.9ZM10.427,5.45h2.9v14.5h-2.9ZM3.176,12.7h2.9v7.252h-2.9Z"
                    fill="#172554"
                    stroke="#ffedd5"
                    strokeWidth="0.5"
                  />
                </g>
              </svg> */}
                <Link href="/report" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full"></span>
                    Report
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/settings")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faGear} className="h-[18px]" />
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21.169"
                height="21.224"
                viewBox="0 0 21.169 21.224"
              >
                <path
                  d="M45.824,21.208a4.3,4.3,0,1,0,4.3,4.3A4.3,4.3,0,0,0,45.824,21.208Zm0,7.59a3.288,3.288,0,1,1,2.328-.961,3.293,3.293,0,0,1-2.328.961Zm9.985-5.547H53.323a7.7,7.7,0,0,0-.585-1.417l1.76-1.79a.529.529,0,0,0,.146-.358.5.5,0,0,0-.146-.358l-2.521-2.521a.5.5,0,0,0-.711,0L49.511,18.56a7.7,7.7,0,0,0-1.407-.535V15.5a.5.5,0,0,0-.5-.5h-3.53a.5.5,0,0,0-.5.5v2.521a7.509,7.509,0,0,0-1.412.585L40.4,16.856a.5.5,0,0,0-.711,0l-2.521,2.521a.511.511,0,0,0,0,.716l1.755,1.75a8.069,8.069,0,0,0-.59,1.417H35.844a.5.5,0,0,0-.5.5v3.53a.5.5,0,0,0,.5.5H38.32a7.877,7.877,0,0,0,.59,1.412l-1.755,1.755a.5.5,0,0,0,0,.716L39.677,34.2a.5.5,0,0,0,.711,0l1.755-1.75a7.862,7.862,0,0,0,1.412.585V35.52a.5.5,0,0,0,.5.5h3.53a.5.5,0,0,0,.5-.5V33.013a8.3,8.3,0,0,0,1.417-.585l1.765,1.735a.5.5,0,0,0,.711,0l2.521-2.521a.53.53,0,0,0,.146-.358.5.5,0,0,0-.146-.358l-1.755-1.755a7.509,7.509,0,0,0,.57-1.382H55.8a.5.5,0,0,0,.5-.5v-3.53a.5.5,0,0,0-.5-.524Zm-.5,3.53h-2.36a.5.5,0,0,0-.5.383,6.788,6.788,0,0,1-.772,1.866.5.5,0,0,0,.091.6l1.669,1.669-1.8,1.8L49.959,31.44a.5.5,0,0,0-.615-.076,6.737,6.737,0,0,1-1.866.782.5.5,0,0,0-.383.5v2.36H44.574V32.65a.5.5,0,0,0-.383-.5,6.8,6.8,0,0,1-1.866-.777.5.5,0,0,0-.615.076L40.04,33.114l-1.8-1.8,1.649-1.694a.5.5,0,0,0,.076-.615,6.8,6.8,0,0,1-.767-1.846.5.5,0,0,0-.5-.383h-2.35V24.259H38.7a.5.5,0,0,0,.5-.383,6.737,6.737,0,0,1,.777-1.866.5.5,0,0,0-.076-.615l-1.669-1.669,1.8-1.8L41.7,19.594a.5.5,0,0,0,.615.076A6.853,6.853,0,0,1,44.18,18.9a.5.5,0,0,0,.383-.5V16.009h2.521v2.36a.5.5,0,0,0,.383.5,6.788,6.788,0,0,1,1.866.772.5.5,0,0,0,.615-.076L51.619,17.9l1.8,1.8L51.76,21.374a.5.5,0,0,0-.076.615,6.722,6.722,0,0,1,.772,1.866.5.5,0,0,0,.5.383h2.36Z"
                  transform="translate(-35.24 -14.9)"
                  fill="#172554"
                  stroke="#172554"
                  strokeWidth="0.2"
                />
              </svg> */}
                <Link href="/settings" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Settings
                  </p>
                </Link>
              </li>

              <li
                className={`relative text-blue-950 hover:text-primary hover:bg-orange-50 p-3.5 rounded flex items-center gap-4 cursor-pointer ${
                  path.includes("/logout")
                    ? "text-primary bg-orange-50 pointer-events-none"
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="h-[18px] w-[18px]"
                />
                <Link href="/logout" legacyBehavior>
                  <p>
                    <span className="absolute top-0 left-0 w-full h-full xl:text-lg"></span>
                    Logout
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
