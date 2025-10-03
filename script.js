// 🎨 1. Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // Used to draw shapes on canvas

const box = 20; // Size of one square (20*20 pixels)
let snake = [{ x:9 * box, y: 10 * box }]; // Snake starts with 1 square
let direction; // Current movement direction
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
};

let score = 0;