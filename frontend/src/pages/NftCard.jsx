import React from "react";
import NFTAddress from "../contractsData/NFT-address.json";
import NFTAbi from "../contractsData/NFT.json"
import marketPlaceAddress from "../contractsData/MarketPlace-address.json"
import marketPlaceAbi from "../contractsData/MarketPlace.json"
import { useState } from "react";
import { ethers } from "ethers";
import { Link } from 'react-router-dom';
import { Button, Modal } from "react-bootstrap";


const SetTransactionSigner = () => {
    //Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    const marketplace = new ethers.Contract(marketPlaceAddress.address, marketPlaceAbi.abi, signer)
    return marketplace
}

const nft = () => {
    //Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    return nft
}






function NftCard({ item, index }) {
    const [Auction, setAuction] = useState(false)
    const [price, setPrice] = useState(null);
    const [time, setTime] = useState(null);
    const [loading, setLoading] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [BidModalShow, setBidModalShow] = useState(false);
    const [FixModalShow, setFixModalShow] = useState(false);








    const sell = async () => {
        try {
            setLoading(true)
            const listingPrice = ethers.utils.parseEther(price)
            await (await nft().setApprovalForAll(item.marketplace, true)).wait()
            const nftId = item.itemId.toString();
            await (await SetTransactionSigner().makeItem(item.nft, nftId, listingPrice)).wait()
            setPrice("")
            setTime("")
            alert("Your NFT is Listed");
            setLoading(false)
            window.location.reload()

        } catch (error) {
            setLoading(false)
            console.log(error)
        }

    }

    const createAuction = async () => {
        try {
            setLoading(true)
            await (await nft().setApprovalForAll(item.marketplace, true)).wait()
            const listingPrice = ethers.utils.parseEther(price)
            const nftId = item.itemId.toString();
            const auctionTime = time;
            await (await SetTransactionSigner().createAuction(item.nft, nftId, listingPrice, auctionTime)).wait()
            setPrice("")
            setTime("")
            alert("NFT Set On Auction")
            setAuction(false)
            setLoading(false)
            window.location.reload()

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    console.log("thedata", item)
    return (
        <>
            <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-12">
                <div className="sc-card-product explode ">
                    <div className="card-media">
                        <Link to="/item-details-01"><img src={item.image} alt="Axies" /></Link>
                        <div className="button-place-bid ">
                            <button onClick={() => setModalShow(true)} className="sc-button style-place-bid style bag fl-button pri-3"><span>NFT Listing</span></button>
                        </div>
                        <Link to="/login" className="wishlist-button heart"><span className="number-like"> NO </span></Link>
                    </div>
                    <div className="card-title mg-bt-16">
                        <h5><Link to="/item-details-01">"{item.name}"</Link></h5>
                    </div>
                    <div className="meta-info">
                        <div className="author">
                            <div className="avatar">
                                <img src={item.image} alt="Axies" />
                            </div>
                            <div className="info">
                                <span>Creator</span>
                                <h6> <Link to="/author-02">"Mohsin"</Link> </h6>
                            </div>
                        </div>
                        <div className="tags">#NFT</div>
                    </div>
                    <div className="card-bottom style-explode">
                        <div className="price">
                            <span>Current Bid</span>
                            <div className="price-details">
                                <h5>$5</h5>
                                <span>=$6</span>
                            </div>
                        </div>
                        <Link to="/activity-01" className="view-history reload">View History</Link>
                    </div>
                </div>
            </div>





            {/* Listing Model */}
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                <Modal.Header closeButton></Modal.Header>

                <div className="modal-body space-y-20 pd-40">
                    <h3>Select Option </h3>
                    <div>
                        <Button onClick={() => setFixModalShow(true)} className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> Fix Price</Button>
                    </div>
                    <div>
                        <Button onClick={() => setBidModalShow(true)} className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> Auction </Button>
                    </div>
                </div>
            </Modal>
         

            {/* Fix Model */}
            <Modal
                show={FixModalShow}
                onHide={() => setFixModalShow(false)}
            >
                <Modal.Header closeButton></Modal.Header>

                <div className="modal-body space-y-20 pd-40">
                    <h3>Fix Price Sale</h3>
                    <p className="text-center">setPrice<span className="price color-popup"></span>
                    </p>
                    <input type="text" className="form-control"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="00.00 ETH" />

                    <Button onClick={sell} className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> List My NFT </Button>
                </div>
            </Modal>



            
            {/* Auction Model */}
            <Modal
                show={BidModalShow}
                onHide={() => setBidModalShow(false)}
            >
                <Modal.Header closeButton></Modal.Header>

                <div className="modal-body space-y-20 pd-40">
                    <h3>Auction Sale</h3>
                    <p className="text-center">set Auction Base Price<span className="price color-popup"></span>
                    </p>
                    <input type="text" className="form-control"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="00.00 ETH" />

        <p className="text-center">set Time<span className="price color-popup"></span>
                    </p>
                    <input type="text" className="form-control"
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="30 Days" />

                    <Button onClick={createAuction} className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> List My NFT </Button>
                </div>
            </Modal>





        </>


    );
}

export default NftCard;