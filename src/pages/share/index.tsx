import React, { useEffect, useRef, useState } from "react";
import tt from "../../assets/share/tt2.png";
import "./share.css";
import down from "../../assets/share/down1.svg";
import copy from "../../assets/share/copy.svg";
import form from "../../assets/share/alert1.svg";
import link from "../../assets/share/link.svg";
import linkD from "../../assets/share/linkD.svg";
import f1 from "../../assets/share/f1.svg";
import f2 from "../../assets/share/f2.svg";
import f3 from "../../assets/share/f3.svg";
import { Link, useNavigate } from "react-router-dom";
import { useGetShareScanQuery } from "../../features/share/ShareApi";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../profile/services/profileApi";
import { showToast } from "../profile/error/ErrorSlice";
import { toPng } from "html-to-image";
import axios from "axios";
import {
  convertToSecureUrl,
  decryptWithAes,
} from "../../services/newEncryption";

interface ShareProps {}

const Share: React.FC<ShareProps> = ({}) => {
  const dispatch = useDispatch();
  const { data } = useGetShareScanQuery({ qr_create: "1" });
  const [invite, setInvite] = useState<any>();

  const getkk = async () => {
    const { data } = await axios.get(
      convertToSecureUrl(
        `${process.env.REACT_APP_API_URL}//user/get_share?qr_create=1`
      )
    );
    const result: any = await decryptWithAes(data);
    setInvite(result);
  };

  useEffect(() => {
    getkk();
  }, []);

  const [copySuccess, setCopySuccess] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const { data: userData, error } = useGetUserQuery(token);
  // console.log(userData)

  const navigate = useNavigate();
  const handleCopy = () => {
    if (userData) {
      const inviteCode = userData.data.invite_code;
      navigator.clipboard
        .writeText(inviteCode)
        .then(() => {
          dispatch(showToast({ message: "已复制", type: "success" }));
          setCopySuccess(true);
        })
        .catch(() => {
          dispatch(showToast({ message: "复制失败", type: "error" }));
          setCopySuccess(false);
        });
    }
  };

  const handleShareLink = () => {
    if (invite) {
      const link = invite?.data?.link;

      navigator.clipboard
        .writeText(link)
        .then(() => {
          dispatch(showToast({ message: "已复制", type: "success" }));
          setCopySuccess(true);
        })
        .catch(() => {
          dispatch(showToast({ message: "复制失败", type: "error" }));
          setCopySuccess(false);
        });
    }
  };

  const handleSaveAsImage = () => {
    if (imageRef.current) {
      toPng(imageRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "share-info.png";
          link.click();
          dispatch(showToast({ message: "保存成功", type: "success" }));
        })
        .catch((err) => {
          console.error("Failed to generate image:", err);
        });
    }
  };
  return (
    <div className="bg-white/30 h-screen flex flex-col p-5 gap-[1px]">
      {/* header */}
      <div className="flex justify-between items-center">
        <Link to="/profile">
          {/* <img src={back} className="" alt="" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.828 10.9999H20V12.9999H7.828L13.192 18.3639L11.778 19.7779L4 11.9999L11.778 4.22192L13.192 5.63592L7.828 10.9999Z"
              fill="#080808"
            />
          </svg>
        </Link>
        <p className="text-[18px] text-[#080808] font-semibold">邀请朋友</p>
        <div></div>
        {/* <div
          // onClick={() => navigate("")}
          className="rule py-[8px] px-[16px] mt-[5px]"
        >
          <a
            target="_blink"
            href="https://cc3e497d.qdhgtch.com:1333/help"
            className=" text-white text-[14px] font-[500]"
          >
            积分商城
          </a>
        </div> */}
      </div>
      {/* blah */}
      <div className=" flex w-full justify-center items-center py-[50px]">
        <img src={tt} alt="" />
      </div>
      <div className=" flex flex-col gap-[20px] bg-white rounded-[8px] shadow-xl shadow-black/10">
        {/* scan */}
        <div className="">
          {invite ? (
            <div
              ref={imageRef}
              className=" flex justify-center  items-center pt-[30px] "
            >
              <div className="py-6 px-10 flex flex-col justify-center items-center gap-[16px]">
                <img
                  className=" w-[180px] h-[180px] rounded-[10px] bg-black shadow-lg shadow-black/10"
                  src={invite?.data.qrcode.data}
                  alt="QR Code"
                />
                {/* data */}
                {userData && (
                  <div className=" hidden">
                    <div className="flex gap-[8px] invite_code px-[16px] py-[8px]">
                      <h1 className=" text-white text-[16px] font-[500] leading-[20px]">
                        我的邀请码 :
                      </h1>
                      <span className=" text-white text-[16px] font-[500] leading-[20px]">
                        {userData.data.invite_code}
                      </span>
                      <img onClick={handleCopy} src={copy} alt="" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className=" flex justify-center items-center pt-[30px]">
              <div className="scan py-6 px-10 flex flex-col justify-center items-center gap-[16px]">
                <div className=" animate-pulse bg-black/30 w-[180px] h-[180px] rounded-[10px]"></div>
                <div className="">
                  <div className="bg-black/30 rounded-[16px] animate-pulse w-[200px] h-[30px] flex gap-[8px]  px-[16px] py-[8px]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* tab */}
        <div className=" pb-[20px]">
          <div className=" flex justify-around items-center">
            {/* friend */}
            <div className="flex flex-col items-center gap-[1px]">
              <img src={f1} alt="" />

              <div className=" flex justify-center items-center gap-1">
                <span className=" text-[12px] font-[400] text-[#000000]">
                  分享链接给好友
                </span>
              </div>
            </div>
            {/* down */}
            <div className=" flex flex-col items-center gap-[1px]">
              <img src={f2} alt="" />
              <div className=" flex justify-center items-center gap-1">
                <span className=" text-[12px] font-[400] text-[#000000]">
                  下载APP
                </span>
              </div>
            </div>
            <div className=" flex flex-col items-center gap-[1px]">
              <img src={f3} alt="" />
              <div className=" flex justify-center items-center gap-1">
                <span className=" text-[12px] font-[400] text-[#000000]">
                  分享链接给好友
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* alert */}
      {/* <div className=" flex justify-center items-center pt-[20px]">
        <div className="fire_box w-[320 px-[12px] py-[4px] flex gap-[7px] justify-center items-center">
          <img src={fire} alt="" />
          <h1 className=" poin text-white/70 text-[12px]">
            使用虚幻百褶裙邀请好友即可获得 40 积分
          </h1>
        </div>
      </div> */}
      {/* invited user */}
      {/* <div className="flex invite_user mx-[20px] justify-around items-center mt-[20px] hidden">
    
        <Link
          to={"https://cc3e497d.qdhgtch.com:1333/"}
          className=" flex flex-col items-center justify-center gap-[8px]"
        >
          <img
            className=" w-[30px] h-[30px] dolar p-[8px]"
            src={dolar}
            alt=""
          />
          <div className=" flex justify-center items-center gap-[6px]">
            <div className=" flex flex-col">
              <h1 className=" text-center text-[12px] font-[500] text-[#CCC3B2]">
                积分兑换
              </h1>
              <h1 className=" text-center text-[8px] font-[400] text-[#CCC3B2]">
                兑换价值百元大礼包
              </h1>
            </div>
            <img src={go} alt="" />
          </div>
        </Link>
        <p className=" line"></p>
        <div
          onClick={() => navigate("/share/member")}
          className=" flex flex-col items-center justify-center gap-[8px]"
        >
          <h1 className=" text-[18px] font-[600] text-white/70">
            {userData?.data?.invite_user_num}
          </h1>
          <div className=" flex justify-center items-center gap-[6px]">
            <h1 className="text-center text-[12px] font-[500] text-[#CCC3B2]">
              我的邀请
            </h1>

            <img src={go} alt="" />
          </div>
        </div>
      </div> */}
      {/* two button */}
      <div className="flex justify-center items-center gap-[16px] py-8">
        {/* copy */}
        <div
          onClick={handleShareLink}
          className=" flex gap-[8px] justify-center items-center px-[20px] py-[16px] bg-[#fff] rounded-[24px] shadow-lg shadow-black/10"
        >
          {/* <img src={link} alt="" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M12.5142 9.44624L14.767 7.19305C16.4105 5.54995 16.4105 2.87582 14.767 1.23272C13.1237 -0.410907 10.4498 -0.410907 8.80651 1.23272L5.55534 4.48389C3.91189 6.12698 3.91189 8.80112 5.55534 10.4442C5.79799 10.687 6.06358 10.8929 6.34462 11.0639L8.08514 9.32322C7.7536 9.24394 7.43913 9.07666 7.18102 8.81872C6.43404 8.07175 6.43404 6.85618 7.18102 6.10939L10.4322 2.85822C11.1792 2.11124 12.3947 2.11124 13.1415 2.85822C13.8885 3.60519 13.8885 4.82058 13.1415 5.56755L12.1864 6.52287C12.58 7.44921 12.6888 8.46799 12.5142 9.44624Z"
              fill="black"
            />
            <path
              d="M3.4858 6.55395L1.23296 8.80696C-0.410663 10.4502 -0.410663 13.1242 1.23296 14.7675C2.87606 16.4109 5.5502 16.4109 7.19347 14.7675L10.4445 11.5163C12.0879 9.87303 12.0877 7.19907 10.4445 5.55597C10.202 5.31314 9.93641 5.10729 9.65536 4.93628L7.91485 6.67697C8.2462 6.75643 8.56067 6.92335 8.81897 7.18147C9.56594 7.92844 9.56594 9.14383 8.81897 9.89081L5.56762 13.142C4.82065 13.8889 3.60526 13.8889 2.85828 13.142C2.11131 12.395 2.11131 11.1796 2.85828 10.4326L3.8136 9.4775C3.41985 8.55116 3.31105 7.5322 3.4858 6.55395Z"
              fill="black"
            />
          </svg>
          <h1 className=" text-black text-[16px] font-[500] ">复制分享链接</h1>
        </div>
        {/* down and save qr card */}
        <div
          onClick={handleSaveAsImage}
          className=" flex gap-[8px] justify-center items-center px-[20px] py-[16px] bg-[#fff] rounded-[24px] shadow-lg shadow-black/10"
        >
          {/* <img src={linkD} alt="" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M9.56403 0.5H6.56581C6.09214 0.5 5.70543 0.885006 5.70543 1.36039V5.68339H3.93486C3.58867 5.68339 3.28641 5.88012 3.14794 6.19759C3.00947 6.51507 3.06773 6.86968 3.3033 7.12467L7.4322 11.6055C7.59431 11.7802 7.82566 11.8824 8.06377 11.8824C8.30356 11.8824 8.53322 11.7811 8.69534 11.6055L12.8257 7.12467C13.0613 6.86968 13.1196 6.51507 12.9811 6.19759C12.8426 5.8801 12.5421 5.68339 12.1942 5.68339H10.4236L10.4245 1.36039C10.4245 0.885028 10.0394 0.5 9.56403 0.5Z"
              fill="black"
            />
            <path
              d="M14.8259 13.9753H1.17425C0.752348 13.9753 0.411865 14.3158 0.411865 14.7377C0.411865 15.1596 0.752348 15.5001 1.17425 15.5001H14.8259C15.2478 15.5001 15.5882 15.1596 15.5882 14.7377C15.5882 14.3158 15.2478 13.9753 14.8259 13.9753Z"
              fill="black"
            />
          </svg>
          <h1 className=" text-black text-[16px] font-[500] ">手动截图保存</h1>
        </div>{" "}
      </div>
    </div>
  );
};

export default Share;
