import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import liveAuctionData from "../assets/fake-data/data-live-auction";
import LiveAuction from "../components/layouts/LiveAuction";
import img1 from "../assets/images/avatar/avt-3.jpg";
import img2 from "../assets/images/avatar/avt-1.jpg";
import img3 from "../assets/images/avatar/avt-1.jpg";
import img4 from "../assets/images/avatar/avt-5.jpg";
import img5 from "../assets/images/avatar/avt-7.jpg";
import img6 from "../assets/images/avatar/avt-8.jpg";
import img7 from "../assets/images/avatar/avt-2.jpg";
import imgdetail1 from "../assets/images/box-item/img-collection23.jpg";
import marketPlaceAddress from "../contractsData/MarketPlace-address.json";
import marketplaceAbi from "../contractsData/MarketPlace.json"
import NFTAbi from "../contractsData/NFT.json"
import NFTAddress from "../contractsData/NFT-address.json"
import { ethers, utils } from "ethers";


const SetTransactionSigner = () => {
  //Get provider from Metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // Set signer
  const signer = provider.getSigner()
  const marketplace = new ethers.Contract(marketPlaceAddress.address, marketplaceAbi.abi, signer)
  return marketplace
}

const SetNFTContract = () => {
  //Get provider from Metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // Set signer
  const signer = provider.getSigner()
  const nftcontract = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
  return nftcontract
}

const { ethereum } = window;

const ItemDetails01 = () => {
  const { item } = useParams();
  const myArray = JSON.parse(decodeURIComponent(item));
  console.log("iTemssssss", myArray)

  const [loding, setLoading] = useState(false)
  const [modal, setmodal] = useState(false)
  const [price, setPrice] = useState(null)
  const [Time, setTime] = useState(0)
  const [bid, setbid] = useState(0)
  const [bidder, setbidder] = useState(null)
  const [NowTime, setNowTime] = useState(0)
  const [account, setAccount] = useState(null)
  const navigate = useNavigate();


  const checkIsWalletConnected = async () => {
    try {
      if (!ethereum) return alert("please install MetaMask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setAccount(accounts[0]);
      } else {
        console.log("No account Found");
      }
    } catch (err) {

      throw new Error("No ethereum Object");
    }
  }

  const getLastTime = async () => {
    try {
      const time = await SetTransactionSigner().getLastTime(myArray.itemId)
      const temp = Number(time.toString())
      const nowDate = Math.floor((new Date()).getTime() / 1000);
      setTime(temp)
      setNowTime(nowDate)
    } catch (error) {
      console.log(error);
    }
  }

  const getHigestBid = async () => {
    try {
      let bid = await SetTransactionSigner().getHighestBid(myArray.itemId);
      setbid(ethers.utils.formatEther(bid))
      console.log("this is bid", bid.toString());
    } catch (error) {
      console.log(error);
    }
  }

  const getHigestBidder = async () => {
    try {
      let bidder = await SetTransactionSigner().getHighestBidder(myArray.itemId);
      setbidder(bidder)
      console.log("this is bid", bidder.toString());
    } catch (error) {
      console.log(error);
    }

  }

  const CancelListing = async () => {
    try {
      setLoading(true)
      await (await SetTransactionSigner().cancelListing(myArray.itemId)).wait();
      setLoading(false);
      navigate('/my-purchases');
    } catch (error) {
      setLoading(false);
      console.log(error);
    }


  }

  const concludeAuction = async () => {
    try {
      setLoading(true);
      await (await SetTransactionSigner().concludeAuction(myArray.itemId, account)).wait();
      setLoading(false);
      navigate('/my-purchases')
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

  }

  const cancellAuction = async () => {
    try {
      setLoading(true);
      await (await SetTransactionSigner().cancellAuction(myArray.itemId, account)).wait();
      setLoading(false);
      navigate('/my-purchases')
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

  }


  const buyMarketItem = async (myArray) => {
    try {
      setLoading(true)
      console.log("this is item id ", myArray.itemId)
      await (await SetTransactionSigner().purchaseItem(myArray.itemId, { value: myArray.totalPrice })).wait()
      setLoading(false);
      // navigate('/my-purchases')
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }


  const placeBid = async () => {
    try {
      setLoading(true);
      const bidding = ethers.utils.parseEther(price)
      await (await SetTransactionSigner().bid(myArray.itemId, { value: bidding })).wait()
      setmodal(false);
      setLoading(false);
      window.location.reload()
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

  }

  function getData(val) {
    setPrice(val.target.value)
  }
  console.log("ITEMIDF+++++++", myArray.itemId)

  useEffect(() => {
    checkIsWalletConnected()
    getLastTime();
    getHigestBid();
    getHigestBidder();
  }, [bidder, bid, account]);


  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return 'completed';
    } else {
      // Render a countdown
      return <span>{hours}:{minutes}:{seconds}</span>;
    }
  };


  const [dataHistory] = useState([
    {
      img: img1,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img2,
      name: "Mason Woodward",
      time: "at 06/10/2021, 3:20 AM",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img3,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img4,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img5,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img6,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
  ]);

  return (
    <div className="item-details">
      <Header />
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Item Details</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="#">Explore</Link>
                  </li>
                  <li>Item Details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="tf-section tf-item-details">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-xl-6 col-md-12">
              <div className="content-left">
                <div className="media">
                  <img src={myArray.image} alt="Axies" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="content-right">
                <div className="sc-item-details">
                  <h2 className="style2">
                    {myArray.name}
                  </h2>
                  <div className="meta-item">
                    <div className="left">
                      <span className="viewed eye">225</span>
                      <span
                        to="/login"
                        className="liked heart wishlist-button mg-l-8"
                      >
                        <span className="number-like">100</span>
                      </span>
                    </div>
                    <div className="right">
                      <Link to="#" className="share"></Link>
                      <Link to="#" className="option"></Link>
                    </div>
                  </div>
                  <div className="client-infor sc-card-product">
                    <div className="meta-info">
                      <div className="author">
                        <div className="avatar">
                          <img src={img6} alt="Axies" />
                        </div>
                        <div className="info">
                          <span>Owned By</span>
                          <h6>
                            {" "}
                            <Link to="/authors">{myArray.seller.slice(0, 20)}....{myArray.seller.slice(30, 36)}</Link>{" "}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="meta-info">
                      <div className="author">
                        <div className="avatar">
                          <img src={img7} alt="Axies" />
                        </div>
                        <div className="info">
                          <span>Create By</span>
                          <h6>
                            {" "}
                            <Link to="/authors">{myArray.seller.slice(0, 20)}....{myArray.seller.slice(30, 36)}</Link>{" "}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>
                    {myArray.description}
                  </p>

          


  {myArray.auction
  ?
   <div className="meta-item-details style2">
    <div className="item meta-price">
                        <span className="heading">Current Bid</span>
                        {bid > 0
                          ?
                          <div className="price">
                            <div className="price-box">
                              <h5>{bid}ETH</h5>
                              <span>= $100.246</span>
                            </div>
                          </div>
                          :
                          <></>
                        }
    </div>
      {myArray.time > 0
      ?
        NowTime < Time
        ?
            account?.toString().toLowerCase() === myArray.seller?.toString().toLowerCase()
            ?
                            <div className="item count-down">
                              <span className="heading style-2">Countdown</span>
                              {<Countdown date={Time * 1000} renderer={renderer} >
                                <span>Auction is in progress</span>
                              </Countdown>
                              }
                            </div>
            :
                            <div className="item count-down">
                              <span className="heading style-2">Countdown</span>
                              {<Countdown date={Time * 1000} renderer={renderer} >
                                <span>Place Bid</span>
                              </Countdown>
                              }
                            </div>
        :
        <>
              {bid > 0 && bidder?.toString().toLowerCase() === account?.toString().toLowerCase()
              ?
                              <Link className="sc-button loadmore style bag fl-button pri-3">
                                <span>Place a bid</span>
                              </Link>
              :
                account?.toString().toLowerCase() !== myArray.seller?.toString().toLowerCase()
                ?
                <Link className="sc-button loadmore style bag fl-button pri-3">
                                  <span> Auction has Ended</span>
                </Link>
                : 
                  bid > 0
                  ?
                  <Link className="sc-button loadmore style bag fl-button pri-3">
                  <span> Auction has Ended</span>
                  </Link>
                  :
                  <Link className="sc-button loadmore style bag fl-button pri-3">
                  <span> Take your NFT</span>
                  </Link>

      
              }
                            
                      {account?.toString().toLowerCase() === myArray.seller?.toString().toLowerCase()
                      ?
                      <Link className="sc-button loadmore style bag fl-button pri-3">
                                  <span>Cancel Listing</span>
                      </Link>
                      :
                      <div></div>
                      }
                            

                            <Link className="sc-button loadmore style bag fl-button pri-3">
                              <span>Place a bid</span>
                            </Link>
        </>                    
      : 
     ''
      }

                    
    </div>
  :
    <div>
                      <div className="meta-item-details style2">
                        <div className="item meta-price" style={{ marginLeft: "176px" }}>
                          <span className="heading">Current Price</span>
                          <div className="price">
                            <div className="price-box">
                              <h5> {ethers.utils.formatEther(myArray.totalPrice)} ETH</h5>
                              <span> = $100.246</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        onClick={() => buyMarketItem(myArray)}
                        className="sc-button loadmore style bag fl-button pri-3"
                      >
                        <span>Buy</span>
                      </Link>
    </div>
  }
              
  {/* //////////////////////////////////////// Bid History Section /////////////////////////////////////// */}
              </div>
              
              
              <div className="flat-tabs themesflat-tabs">
                        <Tabs>
                          <TabList>
                            <Tab>Bid History</Tab>
                            <Tab>Info</Tab>
                            <Tab>Provenance</Tab>
                          </TabList>

                          <TabPanel>
                            <ul className="bid-history-list">
                              {dataHistory.map((item, index) => (
                                <li key={index} item={item}>
                                  <div className="content">
                                    <div className="client">
                                      <div className="sc-author-box style-2">
                                        <div className="author-avatar">
                                          <Link to="#">
                                            <img
                                              src={item.img}
                                              alt="Axies"
                                              className="avatar"
                                            />
                                          </Link>
                                          <div className="badge"></div>
                                        </div>
                                        <div className="author-infor">
                                          <div className="name">
                                            <h6>
                                              <Link to="/authors">
                                                {item.name}{" "}
                                              </Link>
                                            </h6>{" "}
                                            <span> place a bid</span>
                                          </div>
                                          <span className="time">{item.time}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="price">
                                      <h5>{item.price}</h5>
                                      <span>= {item.priceChange}</span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </TabPanel>
                          <TabPanel>
                            <ul className="bid-history-list">
                              <li>
                                <div className="content">
                                  <div className="client">
                                    <div className="sc-author-box style-2">
                                      <div className="author-avatar">
                                        <Link to="#">
                                          <img
                                            src={img1}
                                            alt="Axies"
                                            className="avatar"
                                          />
                                        </Link>
                                        <div className="badge"></div>
                                      </div>
                                      <div className="author-infor">
                                        <div className="name">
                                          <h6>
                                            {" "}
                                            <Link to="/authors">
                                              Mason Woodward{" "}
                                            </Link>
                                          </h6>{" "}
                                          <span> place a bid</span>
                                        </div>
                                        <span className="time">8 hours ago</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </TabPanel>
                          <TabPanel>
                            <div className="provenance">
                              <p>
                                Lorem Ipsum is simply dummy text of the printing and
                                typesetting industry. Lorem Ipsum has been the
                                industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and
                                scrambled it to make a type specimen book. It has
                                survived not only five centuries, but also the leap
                                into electronic typesetting, remaining essentially
                                unchanged. It was popularised in the 1960s with the
                                release of Letraset sheets containing Lorem Ipsum
                                passages, and more recently with desktop publishing
                                software like Aldus PageMaker including versions of
                                Lorem Ipsum.
                              </p>
                            </div>
                          </TabPanel>
                        </Tabs>
              </div>
              
              
              
              </div>
            </div>
          </div>
        </div>
        <LiveAuction data={liveAuctionData} />
        <Footer />
      </div>
    </div>
  );
};

export default ItemDetails01;
