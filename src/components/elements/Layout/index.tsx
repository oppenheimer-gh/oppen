import React from "react";
import { Footer, Navbar } from "..";
import { LayoutProps } from "./interface";

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="h-full">{children}</div>
      <Footer />
    </div>
  );
};
