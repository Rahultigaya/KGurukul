import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  if (currentIndex === null || !images[currentIndex]) return null;

  const currentSrc = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <Dialog
      open={currentIndex !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#090d16",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          },
        },
      }}
    >
      <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 min-h-[350px] sm:min-h-[480px]">
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          aria-label="Close lightbox"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            bgcolor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(4px)",
            zIndex: 10,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Prev Arrow */}
        {hasPrev && (
          <IconButton
            onClick={() => onNavigate(currentIndex - 1)}
            aria-label="Previous image"
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#fff",
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              zIndex: 10,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
            }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
        )}

        {/* Next Arrow */}
        {hasNext && (
          <IconButton
            onClick={() => onNavigate(currentIndex + 1)}
            aria-label="Next image"
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#fff",
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              zIndex: 10,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        )}

        {/* Image view */}
        <div className="max-w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl">
          <img
            src={currentSrc}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Caption bar */}
        <div className="mt-4 text-center">
          <p className="text-xs font-semibold text-slate-400 tracking-wider">
            Photo {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>
    </Dialog>
  );
}
