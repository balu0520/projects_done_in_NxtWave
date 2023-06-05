// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productItemDetails} = props
  const {imageUrl, brand, title, rating, price} = productItemDetails

  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="product-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-rating">
        <p className="similar-product-price">Rs {price}\-</p>
        <span className="similar-product-rating">
          <span className="similar-product-review">{rating}</span>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="review-icon"
          />
        </span>
      </div>
    </li>
  )
}

export default SimilarProductItem
