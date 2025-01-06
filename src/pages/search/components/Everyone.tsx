import { useNavigate } from "react-router-dom";
import "../search.css";
import { useDispatch } from "react-redux";
import { setHistoryData } from "../slice/HistorySlice";

const Everyone = ({
  lists,
  Loading,
  Fetching,
  refetch,
}: {
  lists: any;
  refetch: any;
  Loading: any;
  Fetching: any;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = (query: any) => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div className="px-3 mt-5">
      <div className="flex justify-between items-center">
        <h1 className="history-title1">大家都在搜</h1>
        <a
          className="cursor-pointer "
          onClick={() => {
            refetch();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.55252 3.69401C6.06465 2.38373 7.99918 1.66372 10 1.66651C14.6025 1.66651 18.3334 5.39735 18.3334 9.99984C18.3334 11.7798 17.775 13.4298 16.825 14.7832L14.1667 9.99984H16.6667C16.6668 8.69286 16.2827 7.41468 15.5622 6.32422C14.8418 5.23377 13.8166 4.37914 12.6143 3.86662C11.412 3.35409 10.0856 3.20626 8.79998 3.44153C7.51435 3.67679 6.32623 4.28476 5.38335 5.18985L4.55252 3.69401ZM15.4475 16.3057C13.9354 17.616 12.0009 18.336 10 18.3332C5.39752 18.3332 1.66669 14.6023 1.66669 9.99984C1.66669 8.21984 2.22502 6.56984 3.17502 5.21651L5.83335 9.99984H3.33335C3.33325 11.3068 3.71731 12.585 4.4378 13.6755C5.15829 14.7659 6.18341 15.6205 7.3857 16.1331C8.588 16.6456 9.91442 16.7934 11.2001 16.5582C12.4857 16.3229 13.6738 15.7149 14.6167 14.8098L15.4475 16.3057Z"
              fill="white"
              fill-opacity="0.6"
            />
          </svg>
        </a>
      </div>

      <div className="flex flex-wrap gap-3 py-3">
        {lists?.map((list: any, index: any) => (
          <button
            className="everyone-tab flex items-center cursor-pointer"
            key={index}
            onClick={() => handleClick(list?.word)}
          >
            <span> {list?.word}</span>
            <div>
              {index === 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <rect
                    width="14"
                    height="14"
                    rx="2.33333"
                    fill="url(#paint0_linear_813_6890)"
                  />
                  <path
                    d="M9.78047 9.03623H11.6666V7.76885H11.0179V3.25816H8.07399V2.40991H6.83655V3.25816H5.9883V4.50558H6.83655V4.94468C6.83655 5.09437 6.83655 5.24406 6.82657 5.39375L6.12801 5.14427V6.47152L6.617 6.64117C6.38748 7.43952 5.9883 8.23788 5.3596 9.03623H6.90641C7.31556 8.35763 7.60496 7.70897 7.79457 7.06031L9.27152 7.57924V6.25198L8.03408 5.81288C8.06402 5.53346 8.07399 5.24406 8.07399 4.94468V4.50558H9.78047V9.03623ZM2.38574 11.4912H3.8128L4.61115 9.45536H3.18409L2.38574 11.4912ZM2.48554 6.91062L3.52339 6.73099V7.7888H2.75498V9.03623H4.80076V6.50146L5.71886 6.34179V5.06443L4.80076 5.23408V4.50558H5.61907V3.26814H4.80076V2.44983H3.52339V3.26814H2.58533V4.50558H3.52339V5.46361L2.48554 5.65321V6.91062ZM5.04026 11.4912H6.36752L6.72678 9.45536H5.39952L5.04026 11.4912ZM7.30558 9.45536L7.66484 11.4912H8.9921L8.63284 9.45536H7.30558ZM9.42121 9.45536L10.2196 11.4912H11.6466L10.8483 9.45536H9.42121Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_813_6890"
                      x1="0"
                      y1="0"
                      x2="14"
                      y2="14"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FF3D00" />
                      <stop offset="1" stop-color="#FFA132" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
              {index === 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <rect
                    width="14"
                    height="14"
                    rx="2.33333"
                    fill="url(#paint0_linear_813_6890)"
                  />
                  <path
                    d="M9.78047 9.03623H11.6666V7.76885H11.0179V3.25816H8.07399V2.40991H6.83655V3.25816H5.9883V4.50558H6.83655V4.94468C6.83655 5.09437 6.83655 5.24406 6.82657 5.39375L6.12801 5.14427V6.47152L6.617 6.64117C6.38748 7.43952 5.9883 8.23788 5.3596 9.03623H6.90641C7.31556 8.35763 7.60496 7.70897 7.79457 7.06031L9.27152 7.57924V6.25198L8.03408 5.81288C8.06402 5.53346 8.07399 5.24406 8.07399 4.94468V4.50558H9.78047V9.03623ZM2.38574 11.4912H3.8128L4.61115 9.45536H3.18409L2.38574 11.4912ZM2.48554 6.91062L3.52339 6.73099V7.7888H2.75498V9.03623H4.80076V6.50146L5.71886 6.34179V5.06443L4.80076 5.23408V4.50558H5.61907V3.26814H4.80076V2.44983H3.52339V3.26814H2.58533V4.50558H3.52339V5.46361L2.48554 5.65321V6.91062ZM5.04026 11.4912H6.36752L6.72678 9.45536H5.39952L5.04026 11.4912ZM7.30558 9.45536L7.66484 11.4912H8.9921L8.63284 9.45536H7.30558ZM9.42121 9.45536L10.2196 11.4912H11.6466L10.8483 9.45536H9.42121Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_813_6890"
                      x1="0"
                      y1="0"
                      x2="14"
                      y2="14"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FF3D00" />
                      <stop offset="1" stop-color="#FFA132" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
              {index === 2 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <rect
                    width="14"
                    height="14"
                    rx="2.33333"
                    fill="url(#paint0_linear_813_6890)"
                  />
                  <path
                    d="M9.78047 9.03623H11.6666V7.76885H11.0179V3.25816H8.07399V2.40991H6.83655V3.25816H5.9883V4.50558H6.83655V4.94468C6.83655 5.09437 6.83655 5.24406 6.82657 5.39375L6.12801 5.14427V6.47152L6.617 6.64117C6.38748 7.43952 5.9883 8.23788 5.3596 9.03623H6.90641C7.31556 8.35763 7.60496 7.70897 7.79457 7.06031L9.27152 7.57924V6.25198L8.03408 5.81288C8.06402 5.53346 8.07399 5.24406 8.07399 4.94468V4.50558H9.78047V9.03623ZM2.38574 11.4912H3.8128L4.61115 9.45536H3.18409L2.38574 11.4912ZM2.48554 6.91062L3.52339 6.73099V7.7888H2.75498V9.03623H4.80076V6.50146L5.71886 6.34179V5.06443L4.80076 5.23408V4.50558H5.61907V3.26814H4.80076V2.44983H3.52339V3.26814H2.58533V4.50558H3.52339V5.46361L2.48554 5.65321V6.91062ZM5.04026 11.4912H6.36752L6.72678 9.45536H5.39952L5.04026 11.4912ZM7.30558 9.45536L7.66484 11.4912H8.9921L8.63284 9.45536H7.30558ZM9.42121 9.45536L10.2196 11.4912H11.6466L10.8483 9.45536H9.42121Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_813_6890"
                      x1="0"
                      y1="0"
                      x2="14"
                      y2="14"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FF3D00" />
                      <stop offset="1" stop-color="#FFA132" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Everyone;
