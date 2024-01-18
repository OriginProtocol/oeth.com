import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import App from "next/app";

class MyDocument extends Document {
  render() {
    return (
      <Html dir={this.props.locale === "ar" ? "rtl" : "ltr"}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
