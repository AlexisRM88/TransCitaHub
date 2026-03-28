"use client";

import { useCallback, useRef } from "react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { tourSteps, type TourStep } from "@/data/tourSteps";

interface UseProductTourOptions {
  setActiveTab: (tab: string) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;
}

function waitForElement(selector: string, timeout = 2000): Promise<Element | null> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function filterAvailableSteps(steps: TourStep[]): TourStep[] {
  return steps.filter((step) => {
    if (!step.element) return true;
    if (step.meta?.openCarnet) return true;
    return document.querySelector(step.element as string) !== null;
  });
}

export function useProductTour({
  setActiveTab,
  setIsSettingsOpen,
  setIsProfileOpen,
}: UseProductTourOptions) {
  const driverRef = useRef<Driver | null>(null);
  const stepsRef = useRef<TourStep[]>([]);

  const prepareStep = useCallback(
    async (step: TourStep) => {
      if (step.meta?.closeCarnet) {
        setIsProfileOpen(false);
        await delay(150);
      }
      if (step.meta?.tab) {
        setActiveTab(step.meta.tab);
        if (step.element) {
          await waitForElement(step.element as string);
        }
      }
      if (step.meta?.openCarnet) {
        setIsProfileOpen(true);
        if (step.element) {
          await waitForElement(step.element as string);
        }
      }
    },
    [setActiveTab, setIsProfileOpen]
  );

  const handleNext = useCallback(async () => {
    const obj = driverRef.current;
    if (!obj) return;
    const currentIndex = obj.getActiveIndex();
    if (currentIndex === undefined || currentIndex === null) return;
    const nextIndex = currentIndex + 1;
    const steps = stepsRef.current;
    if (nextIndex < steps.length) {
      await prepareStep(steps[nextIndex]);
    }
    obj.moveNext();
  }, [prepareStep]);

  const handlePrev = useCallback(async () => {
    const obj = driverRef.current;
    if (!obj) return;
    const currentIndex = obj.getActiveIndex();
    if (currentIndex === undefined || currentIndex === null) return;
    const steps = stepsRef.current;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const currentStep = steps[currentIndex];
      if (currentStep.meta?.openCarnet) {
        setIsProfileOpen(false);
        await delay(150);
      }
      await prepareStep(steps[prevIndex]);
    }
    obj.movePrevious();
  }, [prepareStep, setIsProfileOpen]);

  const handleDestroyed = useCallback(() => {
    setIsProfileOpen(false);
    driverRef.current = null;
  }, [setIsProfileOpen]);

  const initDriver = useCallback(() => {
    const steps = filterAvailableSteps(tourSteps);
    stepsRef.current = steps;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0, 0, 0, 0.75)",
      stagePadding: 12,
      stageRadius: 16,
      popoverClass: "transcita-tour-popover",
      nextBtnText: "Siguiente \u2192",
      prevBtnText: "\u2190 Anterior",
      doneBtnText: "\u00a1Entendido!",
      progressText: "{{current}} de {{total}}",
      allowClose: true,
      steps: steps.map((step) => {
        const { meta, ...rest } = step;
        return rest;
      }),
      onNextClick: handleNext,
      onPrevClick: handlePrev,
      onDestroyed: handleDestroyed,
    });

    driverRef.current = driverObj;
    driverObj.drive();
  }, [handleNext, handlePrev, handleDestroyed]);

  const startTour = useCallback(() => {
    setIsSettingsOpen(false);

    setTimeout(() => {
      setActiveTab("comunidad");
      setTimeout(initDriver, 300);
    }, 400);
  }, [setActiveTab, setIsSettingsOpen, initDriver]);

  return { startTour };
}
