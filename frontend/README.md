# 🛒 Promise Organics  Ecommerce Platform

A full-featured ecommerce platform built with modern web technologies, providing seamless shopping experiences for both guest and authenticated users.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [User Types](#-user-types)
- [Pages & Functionality](#-pages--functionality)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)

## 🎯 Overview

This ecommerce platform delivers a modern, responsive shopping experience with comprehensive product management, user authentication, order processing, and payment integration. The platform supports both guest shopping and full user account management with advanced features like wishlists, orders history, and address management.

## ✨ Features

### 🛍️ Core Shopping Features
- **Product Catalog**: Browse products with advanced filtering, sorting, and search
- **Product Details**: Comprehensive product pages with images, descriptions, reviews, and specifications
- **Shopping Cart**: Persistent cart functionality with quantity management
- **Wishlist**: Save favorite products for later (authenticated users)
- **Checkout Process**: Streamlined checkout with multiple payment options
- **Order Management**: Complete order tracking and history

### 👤 User Management
- **Guest Shopping**: Full shopping experience without registration
- **User Authentication**: Secure login/registration system
- **Profile Management**: User dashboard with personal information
- **Address Book**: Manage shipping addresses
- **Order History**: Detailed order tracking and search capabilities

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Real-time Updates**: Live cart updates and inventory status
- **Search & Filters**: Advanced product discovery tools
- **Reviews & Ratings**: Customer feedback system
- **Notifications**: Email confirmations and order updates

## 👥 User Types

### 🕶️ Guest Users
- Browse and search products
- Add items to cart
- Add items to wishlist

### 🔑 Authenticated Users
All guest features plus:
- Save items to wishlist
- Manage multiple addresses
- View complete order history
- Quick search functionality
- Profile and preference management
- Faster checkout with saved information

## 📄 Pages & Functionality

### 🏠 Public Pages (Guest + Authenticated)

#### **Home Page** (`/`)
- Featured products and categories
- Promotional banners and deals

#### **Product Catalog** (`/shop`)
- Grid/list view toggle
- Advanced filtering (price, category, tags, search)
- Pagination with infinite scroll option
- Quick view modal

#### **Product Details** (`/products/:id`)
- High-resolution image gallery
- Detailed product information
- Customer reviews and ratings
- Add to cart/wishlist buttons
- Stock availability status

#### **Search Results** (`/search`)
- Search query results
- Advanced filter sidebar
- Search suggestions and autocomplete

#### **Shopping Cart** (`/cart`)
- Item list with quantity controls
- Price calculations and discounts
- Shipping cost estimation
- Guest/login prompt

#### **Checkout** (`/checkout`)
- Multi-step checkout process
- Shipping address form
- Payment method selection
- Order summary and confirmation
- Real-time validation

### 🔐 Authenticated User Pages

#### **User Dashboard** (`/dashboard`)
- Account overview
- Quick access to orders, wishlist, addresses
- Account details
  
#### **Profile Management** (`/profile`)
- Personal information editing
- Password change functionality

#### **Order Management** (`/orders`)
- Complete order history table
- Search and filter orders

#### **Order Details** (`/orders/:id`)
- Detailed order information
- Item breakdown with images
- Shipping addresses
- Payment method details
- Tracking information

#### **Wishlist** (`/wishlist`)
- Saved products grid
- Move to cart functionality
- Remove from wishlist

#### **Address Book** (`/addresses`)
- List all saved addresses
- Edit existing addresses
- Set default shipping
- Address validation

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19+
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios / React Query

### Backend
- **Runtime**: Node.js / Laravel API
- **Database**: MySQL
- **Authentication**: JWT / Laravel Sanctum
- **Payment Processing**: Payfast

### DevOps & Tools
- **Version Control**: Git / GitHub
- **Deployment**: Vercel / Docker

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Laravel (v12+)
- npm/yarn package manager
- MySQL database
