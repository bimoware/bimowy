"use client";

import { useState } from "react";
import { ArrowContainer, Popover } from "react-tiny-popover";

export default function TestPage() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['right', 'top', 'bottom']}
      onClickOutside={() => setIsPopoverOpen(false)}
      padding={10}
      content={({ position, childRect, popoverRect }: {
        position: 'left' | 'right' | 'top' | 'bottom',
        childRect: DOMRect,
        popoverRect: DOMRect
      }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={'blue'}
          arrowSize={10}
          arrowStyle={{ opacity: 0.7 }}
        >
          <span>Ok</span>
        </ArrowContainer>
      )}
    >
      {/* Trigger element that opens the popover */}
      <span
        onMouseEnter={() => setIsPopoverOpen(true)}
        onMouseLeave={() => setIsPopoverOpen(false)}
      >Hey</span>
    </Popover>
  );
}
