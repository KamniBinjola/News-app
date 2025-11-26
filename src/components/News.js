import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export default class News extends Component {
  static defaultProps = {
    pageSize: 6,
    category: "general", // default category
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
    const apiKey = "61045db818f4677d4199b8f534b1b1f9"; // Your GNews API key

    // Map category prop to GNews topic
    const categoryMap = {
      general: "general",
      business: "business",
      entertainment: "entertainment",
      health: "health",
      science: "science",
      sports: "sports",
      technology: "technology",
    };

    const category = categoryMap[this.props.category] || "general";

    const url = `https://gnews.io/api/v4/top-headlines?country=in&topic=${category}&lang=en&max=10&token=${apiKey}`;

    this.setState({ loading: true });

    try {
      const response = await fetch(url);
      const parsedData = await response.json();

      this.setState({
        articles: parsedData.articles || [],
        loading: false,
        page: 1,
      });
    } catch (err) {
      console.error("Error fetching GNews:", err);
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

    // Client-side pagination
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
                  description={element.description ? element.description.slice(0, 88) : ""}
                  imageUrl={element.image}
                  newsUrl={element.url}
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
