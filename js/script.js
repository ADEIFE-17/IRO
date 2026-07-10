"use strict";

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

const menuBtn = $("#menuBtn");
const navMenu = $("#navMenu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");

    const expanded = menuBtn.getAttribute("aria-expanded") === "true";

    menuBtn.setAttribute("aria-expanded", !expanded);
  });
}

const navLinks = $$("#navMenu a");

if (navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");

      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });
}

const faqQuestions = $$(".faq-question");

if (faqQuestions.length) {
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.parentElement;

      $$(".faq-item").forEach((faq) => {
        if (faq !== item) {
          faq.classList.remove("active");
        }
      });

      item.classList.toggle("active");
    });
  });
}

function formatDate() {
  const today = new Date();

  return today.toLocaleDateString("en-GB", {
    day: "2-digit",

    month: "short",

    year: "numeric",
  });
}

function generateComplaintID() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `IRO-${year}${month}${day}-${random}`;
}

function getReports() {
  const reports = localStorage.getItem("iroReports");

  return reports ? JSON.parse(reports) : [];
}

function saveReports(reports) {
  localStorage.setItem(
    "iroReports",

    JSON.stringify(reports),
  );
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
    });
  });
});

const reportForm = $("#reportForm");

if (reportForm) {
  const successMessage = $("#successMessage");
  const generatedId = $("#generatedId");

  reportForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const complaintId =
      "IRO-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const report = {
      id: complaintId,

      fullname: $("#anonymous").checked
        ? "Anonymous"
        : $("#fullname").value.trim(),

      email: $("#email").value.trim(),

      phone: $("#phone").value.trim(),

      userType: $("#userType").value,

      category: $("#category").value,

      community: $("#community").value,

      location: $("#location").value.trim(),

      title: $("#title").value.trim(),

      description: $("#description").value.trim(),

      status: "Pending",

      stage: "Awaiting Review",

      date: new Date().toLocaleDateString(),
    };

    const reports = JSON.parse(localStorage.getItem("iroReports")) || [];

    reports.push(report);

    localStorage.setItem("iroReports", JSON.stringify(reports));

    generatedId.textContent = complaintId;

    successMessage.classList.add("show");

    reportForm.reset();

    successMessage.scrollIntoView({
      behavior: "smooth",

      block: "center",
    });
  });
}

const trackingForm = $("#trackingForm");

if (trackingForm) {
  const trackingResult = $("#trackingResult");
  const notFound = $("#notFound");

  trackingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const trackingId = $("#trackingId").value.trim();

    const reports = JSON.parse(localStorage.getItem("iroReports")) || [];

    const report = reports.find((item) => item.id === trackingId);

    trackingResult.style.display = "none";
    notFound.classList.remove("show");

    if (!report) {
      notFound.classList.add("show");

      return;
    }

    $("#displayId").textContent = report.id;
    $("#displayTitle").textContent = report.title;
    $("#displayDescription").textContent = report.description;
    $("#displayCategory").textContent = report.category;
    $("#displayCommunity").textContent = report.community;
    $("#displayLocation").textContent = report.location;
    $("#displayName").textContent = report.fullname;
    $("#displayDate").textContent = report.date;
    $("#displayStage").textContent = report.stage;

    const badge = $("#displayStatus");

    badge.textContent = report.status;

    badge.classList.remove("pending", "progress", "resolved");

    switch (report.status) {
      case "Resolved":
        badge.classList.add("resolved");

        $("#timelineTitle").textContent = "Resolved";

        $("#timelineDescription").textContent =
          "The issue has been resolved successfully.";

        break;

      case "In Progress":
        badge.classList.add("progress");

        $("#timelineTitle").textContent = "Investigation Ongoing";

        $("#timelineDescription").textContent =
          "The appropriate authority is currently working on this report.";

        break;

      default:
        badge.classList.add("pending");

        $("#timelineTitle").textContent = "Awaiting Review";

        $("#timelineDescription").textContent =
          "Your report has been received and is waiting to be reviewed.";
    }

    trackingResult.style.display = "block";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const successMessage = $("#successMessage");

  if (successMessage) {
    successMessage.classList.remove("show");
  }

  const notFound = $("#notFound");

  if (notFound) {
    notFound.classList.remove("show");
  }
});
