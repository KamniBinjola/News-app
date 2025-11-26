import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export default class News extends Component {
  static defaultProps = {
    pageSize: 6,
    category: "general",
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
      totalResults: 0,
    };
  }

  componentDidMount() {
    this.fetchNews();
  }

  // 🔥 Category-wise Indian news (WORKS on free plan)
  fetchNews = async () => {
    const apiKey = "81a2d2d5e54056bddeb502b4fba67582";

    // category wise indian news keywords
    const keywordMap = {
      general: "India",
      business: "India business",
      entertainment: "India entertainment",
      health: "India health",
      science: "India science",
      sports: "India sports",
      technology: "India technology",
    };

    const categoryKeyword = keywordMap[this.props.category] || "India";

    let url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${categoryKeyword}&languages=en&limit=${this.props.pageSize}&offset=${(this.state.page - 1) * this.props.pageSize}`;

    this.setState({ loading: true });

    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.data || [],
      totalResults: parsedData.pagination ? parsedData.pagination.total : 0,
      loading: false,
    });
  };

  handlePrevClick = async () => {
    await this.setState({ page: this.state.page - 1 });
    this.fetchNews();
  };

  handleNextClick = async () => {
    await this.setState({ page: this.state.page + 1 });
    this.fetchNews();
  };

  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center" style={{ marginTop: "70px" }}>
          NewsGlider - India {this.props.category} News
        </h2>

        {this.state.loading && <Spinner />}

        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.description ? element.description.slice(0, 88) : ""}
                  imageUrl={element.image}
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
            disabled={this.state.page * this.props.pageSize >= this.state.totalResults}
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
