import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export default class News extends Component {
  static defaultProps = {
    pageSize: 6,
    category: "all", // default Inshorts category
  };

  static propTypes = {
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  componentDidMount() {
    this.fetchNews();
  }

  fetchNews = async () => {
    // Map your category props to valid Inshorts categories
    const validCategories = [
      "all", "national", "business", "sports",
      "world", "politics", "technology", "startup",
      "entertainment", "miscellaneous", "hatke",
      "science", "automobile"
    ];

    const category = validCategories.includes(this.props.category)
      ? this.props.category
      : "all";

    this.setState({ loading: true });

    try {
      const response = await fetch(
        `https://inshortsapi.vercel.app/news?category=${category}`
      );
      const parsedData = await response.json();
      const articles = parsedData.data || [];

      this.setState({
        articles: articles,
        loading: false,
        page: 1, // reset page on new fetch
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  };

  handlePrevClick = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 });
    }
  };

  handleNextClick = () => {
    const totalPages = Math.ceil(this.state.articles.length / this.props.pageSize);
    if (this.state.page < totalPages) {
      this.setState({ page: this.state.page + 1 });
    }
  };

  render() {
    const { articles, loading, page } = this.state;
    const { pageSize } = this.props;

    // Pagination: slice articles for current page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentArticles = articles.slice(startIndex, endIndex);

    return (
      <div className="container my-3">
        <h2 className="text-center" style={{ marginTop: "70px" }}>
          NewsGlider - India {this.props.category} News
        </h2>

        {loading && <Spinner />}

        <div className="row">
          {!loading &&
            currentArticles.map((element, index) => (
              <div className="col-md-4" key={index}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.content ? element.content.slice(0, 88) : ""}
                  imageUrl={element.imageUrl || element.image}
                  newsUrl={element.readMoreUrl || "#"}
                />
              </div>
            ))}
        </div>

        {/* Pagination buttons */}
        <div className="container d-flex justify-content-between my-3">
          <button
            disabled={page <= 1}
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            ← Previous
          </button>

          <button
            disabled={page * pageSize >= articles.length}
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next →
          </button>
        </div>
      </div>
    );
  }
}
