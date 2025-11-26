import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export default class News extends Component {
  static defaultProps = {
    country: "us",
    pageSize: 6,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    this.fetchNews();
  }

  fetchNews = async () => {
    const apiKey = "81a2d2d5e54056bddeb502b4fba67582"; // your mediastack key
    // Use https and include sort to reliably get results
    const url = `https://api.mediastack.com/v1/news?access_key=${apiKey}&categories=${this.props.category}&limit=${this.props.pageSize}&offset=${(this.state.page - 1) * this.props.pageSize}&sort=published_desc`;

    this.setState({ loading: true });

    try {
      const res = await fetch(url);
      const parsedData = await res.json();

      // parsedData.data is array of articles, parsedData.pagination may hold total
      this.setState({
        articles: parsedData.data || [],
        totalResults: parsedData.pagination ? parsedData.pagination.total : (parsedData.data ? parsedData.data.length : 0),
        loading: false,
      });
    } catch (error) {
      // safe fallback on network/API error
      console.error("Fetch error:", error);
      this.setState({ articles: [], totalResults: 0, loading: false });
    }
  };

  handlePrevClick = async () => {
    if (this.state.page <= 1) return;
    await this.setState({ page: this.state.page - 1 });
    this.fetchNews();
  };

  handleNextClick = async () => {
    // If totalResults unknown (0), allow next once; otherwise check bound
    const maxPage = this.state.totalResults ? Math.ceil(this.state.totalResults / this.props.pageSize) : Infinity;
    if (this.state.page + 1 > maxPage) return;
    await this.setState({ page: this.state.page + 1 });
    this.fetchNews();
  };

  render() {
    return (
      <div className="container my-3">
        {/* push content below fixed navbar */}
        <h2 className="text-center" style={{ marginTop: "70px" }}>
          NewsGlider - Top Headlines ({this.props.category})
        </h2>

        {this.state.loading && <Spinner />}

        {!this.state.loading && this.state.articles.length === 0 && (
          <p className="text-center">No news available right now.</p>
        )}

        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.description ? element.description.slice(0, 88) : ""}
                  imageUrl={element.image || element.thumbnail || ""}
                  newsUrl={element.url}
                />
              </div>
            ))}
        </div>

        <div className="container d-flex justify-content-between my-3">
          <button
            disabled={this.state.page <= 1}
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            ← Previous
          </button>

          <button
            disabled={this.state.page * this.props.pageSize >= (this.state.totalResults || Infinity)}
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
