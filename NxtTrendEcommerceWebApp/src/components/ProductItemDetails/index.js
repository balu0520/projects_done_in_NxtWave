// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, count: 1, productItems: []}

  componentDidMount() {
    this.getProductItemDetails()
  }

  onClickSub = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onClickAdd = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  getProductsData = eachData => ({
    id: eachData.id,
    imageUrl: eachData.image_url,
    title: eachData.title,
    price: eachData.price,
    description: eachData.description,
    brand: eachData.brand,
    totalReviews: eachData.total_reviews,
    rating: eachData.rating,
    availability: eachData.availability,
    similarProducts: this.getSimilarProducts(eachData.similar_products),
  })

  getSimilarProducts = ProductsData => {
    const newSimilarProductData = ProductsData.map(similarProduct => ({
      id: similarProduct.id,
      imageUrl: similarProduct.image_url,
      title: similarProduct.title,
      style: similarProduct.style,
      price: similarProduct.price,
      description: similarProduct.description,
      brand: similarProduct.brand,
      totalReviews: similarProduct.total_reviews,
      rating: similarProduct.rating,
      availability: similarProduct.availability,
    }))
    return newSimilarProductData
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      console.log(data)
      const updatedData = this.getProductsData(data)
      this.setState({
        productItems: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({productItems: [], apiStatus: apiStatusConstants.failure})
    }
  }

  onClickFailure = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getProductLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getProductFailureView = () => (
    <div className="product-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="product-failure-icon"
      />
      <h1 className="product-failure-heading">Product Not Found</h1>
      <button
        type="button"
        className="product-failure-btn"
        onClick={this.onClickFailure}
      >
        Continue Shopping
      </button>
    </div>
  )

  getProductSuccessView = () => {
    const {productItems, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productItems
    console.log(similarProducts)

    return (
      <div className="product-item-details-container">
        <div className="product-item-container">
          <img src={imageUrl} alt="product" className="product-item-img" />
          <div className="product-item-description-container">
            <h1 className="product-item-title">{title}</h1>
            <p className="product-item-price">Rs {price}\-</p>
            <div className="product-item-review-container">
              <span className="rating">
                <p className="product-item-review">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="review-icon"
                />
              </span>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-item-description">{description}</p>
            <p className="product-item-availability">
              Available:<p className="product-solution">{availability}</p>
            </p>
            <p className="product-item-availability">
              Brand: <p className="product-solution">{brand}</p>
            </p>
            <div className="product-count-container">
              <button
                type="button"
                className="btn"
                onClick={this.onClickSub}
                testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="count-para">{count}</p>
              <button
                type="button"
                className="btn"
                onClick={this.onClickAdd}
                testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-to-cart-btn" type="button">
              Add to Cart
            </button>
          </div>
        </div>
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              productItemDetails={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  getDetails = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getProductSuccessView()
      case apiStatusConstants.failure:
        return this.getProductFailureView()
      case apiStatusConstants.inProgress:
        return this.getProductLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="test">{this.getDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
