import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export default class News extends Component {
  static defaultProps = {
    pageSize: 6,
    category: "general",  // default category
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
    const country = "in";  // India
    const cat = this.props.category; // e.g. "business", "sports", etc.

    const url = `https://saurav.tech/NewsAPI/top-headlines/category/${cat}/${country}.json`;

    this.setState({ loading: true });
    try {
      let response = await fetch(url);
      let data = await response.json();
      // According to API docs, JSON has structure { status: "...", totalResults: ..., articles: [...]}
      const articles = data.articles || [];
      this.setState({ articles, loading: false, page: 1 });
    } catch (err) {
      console.error("Error fetching Saurav NewsAPI:", err);
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

    // Pagination: compute slice for current page
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentArticles = articles.slice(start, end);

    return (
      <div className="container my-3">
        <h2 className="text-center" style={{ marginTop: "70px" }}>
          NewsGlider — India {this.props.category} News
        </h2>

        {loading && <Spinner />}

        <div className="row">
          {!loading && currentArticles.map((element, index) => (
            <div className="col-md-4" key={index}>
              <NewsItem
                title={element.title ? element.title.slice(0, 45) : ""}
                description={element.description ? element.description.slice(0, 88) : ""}
                imageUrl={element.urlToImage || element.image || ""}
                newsUrl={element.url}
              />
            </div>
          ))}
        </div>

  <div className="container d-flex justify-content-between my-3">
          <button
            disabled={page <= 1}
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            ← Previous
          </button>
    <button
            disabled={pageSize * page >= articles.length}
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
