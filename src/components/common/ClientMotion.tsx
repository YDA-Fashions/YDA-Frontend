"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface MotionSectionProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
}

export const MotionSection = ({ children, ...props }: MotionSectionProps) => {
  return <motion.section {...props}>{children}</motion.section>;
};

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export const MotionDiv = ({ children, ...props }: MotionDivProps) => {
  return <motion.div {...props}>{children}</motion.div>;
};

export const MotionP = ({ children, ...props }: HTMLMotionProps<"p">) => {
  return <motion.p {...props}>{children}</motion.p>;
};

export const MotionH1 = ({ children, ...props }: HTMLMotionProps<"h1">) => {
  return <motion.h1 {...props}>{children}</motion.h1>;
};
