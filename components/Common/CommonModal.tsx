"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

function GenericModal({ isOpen, onClose, title, body, footer, size = "md" }: GenericModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalContent>
        {title && <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>}
        {body && <ModalBody>{body}</ModalBody>}
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}

export default GenericModal;
