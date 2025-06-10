// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error details:", errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>Error: {this.state.error?.toString()}</p>
          <p>Details: {this.state.errorInfo?.componentStack}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
