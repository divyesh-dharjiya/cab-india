"use client";
import { CloseButton, createToaster, Portal, Stack, Toast, Toaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export default function AppToaster() {
  return (
    <Portal>
      <Toaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            <Toast.Indicator />
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Stack>
            {toast.closable && (
              <Toast.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Toast.CloseTrigger>
            )}
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  );
}
