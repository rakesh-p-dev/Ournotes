"use client";

import React, { useState } from "react";

export default function ClickToggle() {
  // Continuous left-right animation for the arrow. No button.
  return (
    <div className="flex items-center gap-3">
      {/* Visually-hidden label for accessibility */}
      <span className="sr-only">Navigation hint</span>

      {/* Arrow indicator: continuously slides left->right to draw attention. Theme-aware coloring, no background. */}
      <div className="flex items-center">
        <svg
          className={`w-5 h-5 text-gray-900 dark:text-gray-100 anim-slide-right`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
