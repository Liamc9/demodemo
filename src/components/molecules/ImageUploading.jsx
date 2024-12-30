// src/components/molecules/ImageUploading.jsx

import React, { useEffect, useRef } from "react";
import dragula from "dragula";
import "dragula/dist/dragula.css"; // Import Dragula CSS
import { TrashIcon, PlusIcon } from "../icons/Icons"; // Ensure these icons are correctly imported
import { v4 as uuidv4 } from "uuid"; // Import UUID
import { ToastContainer, toast } from "react-toastify"; // Import React Toastify
import "react-toastify/dist/ReactToastify.css"; // Import React Toastify CSS
import PropTypes from "prop-types"; // Import PropTypes for validation

const ImageUploading = ({
  uploadedImages = [],
  setUploadedImages = () => {},
  maxImages = 6,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif"],
  customMessages = {
    maxLimit: "You can only upload up to {maxImages} images.",
    invalidFormat: "Only JPG, PNG, and GIF formats are allowed.",
    success: "You have successfully uploaded {count} images.",
  },
}) => {
  const inputRef = useRef(null);
  const imageListRef = useRef(null);

  // Initialize Dragula for drag-and-drop functionality
  useEffect(() => {
    if (!imageListRef.current) return;

    const drake = dragula([imageListRef.current], {
      moves: (el) => el.classList.contains("draggable-item"),
    });

    // Function to disable scrolling by adding 'no-scroll' class
    const disableScroll = () => {
      document.body.classList.add("no-scroll");
      // Prevent touchmove events
      document.addEventListener("touchmove", preventDefault, { passive: false });
    };

    // Function to enable scrolling by removing 'no-scroll' class
    const enableScroll = () => {
      document.body.classList.remove("no-scroll");
      // Remove touchmove event listener
      document.removeEventListener("touchmove", preventDefault);
    };

    // Prevent default behavior for touchmove
    const preventDefault = (e) => {
      e.preventDefault();
    };

    // Attach event listeners for Dragula
    drake.on("drag", () => {
      disableScroll();
    });

    drake.on("dragend", () => {
      enableScroll();
    });

    drake.on("drop", () => {
      const newOrderIds = Array.from(imageListRef.current.children)
        .filter((child) => child.classList.contains("draggable-item"))
        .map((child) => child.getAttribute("data-id"));
      const reorderedImages = newOrderIds.map((id) =>
        uploadedImages.find((img) => img.id === id)
      );
      setUploadedImages(reorderedImages);
    });

    // Attach mousedown and touchstart events to draggable items to disable scroll immediately
    const handlePointerDown = () => {
      disableScroll();
    };

    const draggableItems = imageListRef.current.querySelectorAll(".draggable-item");
    draggableItems.forEach((item) => {
      item.addEventListener("mousedown", handlePointerDown);
      item.addEventListener("touchstart", handlePointerDown);
    });

    return () => {
      drake.destroy();
      enableScroll(); // Ensure scrolling is enabled if component unmounts during drag
      draggableItems.forEach((item) => {
        item.removeEventListener("mousedown", handlePointerDown);
        item.removeEventListener("touchstart", handlePointerDown);
      });
    };
  }, [uploadedImages, setUploadedImages]);

  // Helper function to crop image to 1:1 aspect ratio
  const cropImageToSquare = (file) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.src = url;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(image.width, image.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          (image.width - size) / 2,
          (image.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            const croppedFile = new File([blob], file.name, { type: file.type });
            resolve(croppedFile);
            URL.revokeObjectURL(url);
          },
          file.type,
          1
        );
      };
      image.onerror = () => {
        reject(new Error("Failed to load image"));
        URL.revokeObjectURL(url);
      };
    });
  };

  // Handle file uploads with automatic cropping
  const handleFiles = async (files) => {
    const availableSlots = maxImages - uploadedImages.length;
    if (availableSlots <= 0) {
      toast.error(customMessages.maxLimit.replace("{maxImages}", maxImages));
      return;
    }

    const validFiles = Array.from(files)
      .filter((file) => acceptedFormats.includes(file.type))
      .slice(0, availableSlots);

    if (validFiles.length < files.length) {
      if (uploadedImages.length + validFiles.length >= maxImages) {
        toast.warn(
          customMessages.maxLimit.replace("{maxImages}", maxImages),
          { autoClose: 5000 }
        );
      }
      toast.warn(
        customMessages.invalidFormat.replace(
          "{formats}",
          acceptedFormats.join(", ")
        ),
        { autoClose: 5000 }
      );
    }

    if (validFiles.length > 0) {
      try {
        const croppedImages = await Promise.all(
          validFiles.map(async (file) => {
            const croppedFile = await cropImageToSquare(file);
            return {
              id: uuidv4(),
              file: croppedFile,
              preview: URL.createObjectURL(croppedFile),
            };
          })
        );

        setUploadedImages((prev) => [...prev, ...croppedImages]);
        toast.success(
          customMessages.success.replace("{count}", croppedImages.length),
          { autoClose: 3000 }
        );
      } catch (error) {
        console.error("Error cropping images:", error);
        toast.error("Failed to process some images.", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id) => {
    const updatedImages = uploadedImages.filter((img) => img.id !== id);
    setUploadedImages(updatedImages);
    const removedImage = uploadedImages.find((img) => img.id === id);
    if (removedImage) {
      URL.revokeObjectURL(removedImage.preview);
    }
  };

  const onButtonClick = () => {
    if (uploadedImages.length >= maxImages) {
      toast.error(customMessages.maxLimit.replace("{maxImages}", maxImages));
      return;
    }
    inputRef.current.click();
  };

  const onKeyPressAddImage = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onButtonClick();
    }
  };

  // Generate grid items with images, Add Image button, and placeholders
  const renderGridItems = () => {
    const items = [];
    let addButtonRendered = false;

    for (let i = 0; i < maxImages; i++) {
      const image = uploadedImages[i];
      if (image) {
        // Render uploaded image
        items.push(
          <div
            key={image.id}
            data-id={image.id}
            className="relative draggable-item bg-white rounded-lg shadow overflow-hidden cursor-grab aspect-square border border-gray-200"
          >
            {/* Image */}
            <img
              src={image.preview}
              alt={`Uploaded image ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 hover:bg-red-100 transition-colors duration-300"
              aria-label="Remove image"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        );
      } else if (!addButtonRendered) {
        // Render Add Image button in the first empty slot
        items.push(
          <div
            key="add-button"
            className="add-image-card bg-gray-100 rounded-lg shadow flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-300 aspect-square border border-dashed border-gray-300"
            onClick={onButtonClick}
            tabIndex={0}
            onKeyDown={onKeyPressAddImage}
            aria-label="Add Image"
          >
            <PlusIcon className="w-6 h-6 text-gray-500" />
          </div>
        );
        addButtonRendered = true;
      } else {
        // Render placeholder
        items.push(
          <div
            key={`placeholder-${i}`}
            className="relative bg-gray-100 rounded-lg shadow overflow-hidden aspect-square border border-dashed border-gray-300"
          >
            {/* Optional: Add a subtle icon or text to indicate a placeholder */}
          </div>
        );
      }
    }

    return items;
  };

  return (
    <div className="px-2 mb-12"> {/* Reduced horizontal padding and bottom margin */}
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Uploaded Images Grid with 'Add Image' Button and Placeholders */}
      <div
        ref={imageListRef}
        className="grid grid-cols-3 gap-1" // Reduced gap between grid items
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {renderGridItems()}
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedFormats.join(",")}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

// PropTypes for validation
ImageUploading.propTypes = {
  uploadedImages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      file: PropTypes.instanceOf(File),
      preview: PropTypes.string.isRequired,
      url: PropTypes.string, // Optional: Existing image URLs
    })
  ).isRequired,
  setUploadedImages: PropTypes.func.isRequired,
  maxImages: PropTypes.number,
  acceptedFormats: PropTypes.arrayOf(PropTypes.string),
  customMessages: PropTypes.shape({
    maxLimit: PropTypes.string,
    invalidFormat: PropTypes.string,
    success: PropTypes.string,
  }),
};

export default ImageUploading;
