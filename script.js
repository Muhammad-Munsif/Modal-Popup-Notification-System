document.addEventListener("DOMContentLoaded", function () {
  // Modal System
  const modalBackdrop = document.getElementById("modalBackdrop");
  let activeModal = null;

  // Fixed typo in centeredModalBtn ID
  const modalButtons = {
    defaultModalBtn: createModal(
      "Default Modal",
      "This is a default modal with some content. Click outside or press ESC to close.",
      "default"
    ),
    largeModalBtn: createModal(
      "Large Modal",
      "This modal has a larger width. Useful for more content. ".repeat(10),
      "large"
    ),
    scrollableModalBtn: createModal(
      "Scrollable Modal",
      Array(30)
        .fill("This content is long enough to make the modal scrollable. ")
        .join(""),
      "scrollable"
    ),
    centeredModalBtn: createModal(
      "Centered Modal",
      "This modal is vertically centered on the page.",
      "centered"
    ),
  };

  Object.entries(modalButtons).forEach(([buttonId, modal]) => {
    document.getElementById(buttonId).addEventListener("click", () => {
      openModal(modal);
    });
  });

  function createModal(title, content, type = "default") {
    const modal = document.createElement("div");
    modal.className = "fixed z-50 hidden opacity-0 transform";

    let modalClasses =
      "bg-white rounded-lg shadow-xl transform transition-all modal-content";

    switch (type) {
      case "large":
        modalClasses += " w-full max-w-4xl";
        break;
      case "scrollable":
        modalClasses += " w-full max-w-2xl overflow-y-auto";
        break;
      case "centered":
        modalClasses += " w-full max-w-md top-1/2 -translate-y-1/2";
        break;
      default:
        modalClasses += " w-full max-w-md";
    }

    modal.innerHTML = `
                    <div class="${modalClasses}">
                        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
                            <button class="modal-close-btn text-gray-400 hover:text-gray-500">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="p-4 text-gray-600">
                            ${content}
                        </div>
                        <div class="p-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition">
                                Cancel
                            </button>
                            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                                Confirm
                            </button>
                        </div>
                    </div>
                `;

    document.body.appendChild(modal);

    modal
      .querySelector(".modal-close-btn")
      .addEventListener("click", () => closeModal(modal));
    modal
      .querySelector(".bg-gray-200")
      .addEventListener("click", () => closeModal(modal));

    return modal;
  }

  function openModal(modal) {
    if (activeModal) closeModal(activeModal);

    activeModal = modal;
    modalBackdrop.classList.remove("hidden");
    modal.classList.remove("hidden");

    // Trigger reflow
    void modal.offsetWidth;

    modalBackdrop.classList.add("opacity-100");
    modal.classList.add("opacity-100", "scale-100");

    positionModal(modal);
    document.addEventListener("keydown", handleEscape);
  }

  function closeModal(modal) {
    modalBackdrop.classList.remove("opacity-100");
    modal.classList.remove("opacity-100", "scale-100");

    setTimeout(() => {
      modal.classList.add("hidden");
      modalBackdrop.classList.add("hidden");
      activeModal = null;
    }, 200);

    document.removeEventListener("keydown", handleEscape);
  }

  function positionModal(modal) {
    const modalContent = modal.firstElementChild;
    const windowHeight = window.innerHeight;
    const modalHeight = modalContent.offsetHeight;

    if (modal.classList.contains("top-1/2")) {
      modal.style.left = "50%";
      modal.style.transform = "translate(-50%, -50%)";
    } else {
      const top = Math.max(20, (windowHeight - modalHeight) / 4);
      modal.style.top = `${top}px`;
      modal.style.left = "50%";
      modal.style.transform = "translateX(-50%)";
    }
  }

  function handleEscape(e) {
    if (e.key === "Escape" && activeModal) {
      closeModal(activeModal);
    }
  }

  modalBackdrop.addEventListener("click", () => {
    if (activeModal) closeModal(activeModal);
  });

  // Notification System
  const notificationContainer = document.getElementById(
    "notificationContainer"
  );
  let notificationId = 0;

  document.getElementById("successNotifBtn").addEventListener("click", () => {
    showNotification(
      "Success!",
      "Your action was completed successfully.",
      "success"
    );
  });

  document.getElementById("errorNotifBtn").addEventListener("click", () => {
    showNotification(
      "Error!",
      "Something went wrong. Please try again.",
      "error"
    );
  });

  document.getElementById("warningNotifBtn").addEventListener("click", () => {
    showNotification(
      "Warning!",
      "This action requires your attention.",
      "warning"
    );
  });

  document.getElementById("infoNotifBtn").addEventListener("click", () => {
    showNotification("Info", "Here is some information for you.", "info");
  });

  document.getElementById("customNotifBtn").addEventListener("click", () => {
    showNotification(
      "Custom Notification",
      "This notification has a custom icon and longer timeout.",
      "custom",
      "fas fa-star",
      5000
    );
  });

  function showNotification(
    title,
    message,
    type = "info",
    icon = null,
    timeout = 3000
  ) {
    const id = `notification-${notificationId++}`;
    let iconClass = "fas fa-info-circle";
    let bgColor = "bg-blue-100";
    let textColor = "text-blue-800";
    let borderColor = "border-blue-200";

    switch (type) {
      case "success":
        iconClass = "fas fa-check-circle";
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        borderColor = "border-green-200";
        break;
      case "error":
        iconClass = "fas fa-times-circle";
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        borderColor = "border-red-200";
        break;
      case "warning":
        iconClass = "fas fa-exclamation-triangle";
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        borderColor = "border-yellow-200";
        break;
      case "custom":
        iconClass = icon || "fas fa-bell";
        bgColor = "bg-indigo-100";
        textColor = "text-indigo-800";
        borderColor = "border-indigo-200";
        break;
    }

    const notification = document.createElement("div");
    notification.id = id;
    notification.className = `${bgColor} ${borderColor} border-l-4 ${textColor} p-4 rounded shadow-lg transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
                    <div class="flex items-start">
                        <div class="flex-shrink-0 ${textColor} text-lg mr-3">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold">${title}</h4>
                            <p class="text-sm mt-1">${message}</p>
                        </div>
                        <button class="notification-close-btn ml-2 text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 10);

    notification
      .querySelector(".notification-close-btn")
      .addEventListener("click", () => {
        removeNotification(id);
      });

    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
  }

  function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  window.addEventListener("resize", () => {
    if (activeModal) {
      positionModal(activeModal);
    }
  });
});
