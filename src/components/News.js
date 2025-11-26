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
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&page=${this.state.page}&pageSize=${this.props.pageSize}&apiKey=bed57056a70e41f2a6a73d8013cfb88a`;

    this.setState({ loading: true });

    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles || [],
      totalResults: parsedData.totalResults || 0,
      loading: false,
    });
  };

  handlePrevClick = async () => {
    await this.setState({ page: this.state.page - 1 });
    this.fetchNews();
  };

  handleNextClick = async () => {
    if (this.state.page + 1 <= Math.ceil(this.state.totalResults / this.props.pageSize)) {
      await this.setState({ page: this.state.page + 1 });
      this.fetchNews();
    }
  };

  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center" style={{ marginTop: "90px" }}>
          NewsGlider - Top Headlines ({this.props.category})
        </h2>

        {this.state.loading && <Spinner />}

        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.description ? element.description.slice(0, 88) : ""}
                  imageUrl={element.urlToImage}
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
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
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
