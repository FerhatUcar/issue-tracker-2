"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatDate, isSubscriptionActive } from "@/app/helpers";
import { SubscriptionStatus } from "@prisma/client";
import { HiOutlineArrowRight } from "react-icons/hi2";

type Props = {
  status: SubscriptionStatus | null;
  currentPeriodEnd: string | null;
  workspaceLimit: number;
  ownedWorkspaceCount: number;
};

const FEATURE_LIST = [
  "Unlimited workspaces and members",
  "Priority notifications and alerts",
  "Access to upcoming beta features",
];

export const BillingSection = ({
  status,
  currentPeriodEnd,
  workspaceLimit,
  ownedWorkspaceCount,
}: Props) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const hasActiveSubscription = isSubscriptionActive(status);

  const nextRenewal = useMemo(() => {
    if (!currentPeriodEnd) return null;
    return formatDate(currentPeriodEnd, false);
  }, [currentPeriodEnd]);

  const handleCheckout = async () => {
    setIsRedirecting(true);

    try {
      const { data } = await axios.post<{ url: string }>(
        "/api/stripe/checkout",
      );

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("We couldn't redirect you to the checkout page.");
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleManage = async () => {
    setIsPortalLoading(true);

    try {
      const { data } = await axios.post<{ url: string }>(
        "/api/stripe/portal",
      );

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("We couldn't open the subscription settings.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="3" my="3">
      <Card>
        <Flex justify="between" align="start">
          <div>
            <Heading size="3" mb="1">
              {hasActiveSubscription ? "Pro plan" : "Free plan"}
            </Heading>
            <Text color="gray" size="2">
              {hasActiveSubscription
                ? "Your subscription is active."
                : "Upgrade to Rocket Issues Pro to get unlimited workspaces and more features."}
            </Text>
          </div>
          <Badge color={hasActiveSubscription ? "green" : "orange"}>
            {hasActiveSubscription ? "Active" : "Free"}
          </Badge>
        </Flex>

        <Separator my="3" />

        <Flex direction="column" gap="3">
          {FEATURE_LIST.map((feature) => (
            <Flex key={feature} align="center" gap="2">
              <Badge color="gray" variant="soft">
                +
              </Badge>
              <Text>{feature}</Text>
            </Flex>
          ))}
        </Flex>

        <Separator my="3" />

        <Flex justify="between" align="center" wrap="wrap" gap="3">
          <Flex direction="column" gap="1">
            <Text size="2" weight="bold">
              Workspaces
            </Text>
            <Text color="gray" size="2">
              {hasActiveSubscription
                ? "Limitless workspaces."
                : `${ownedWorkspaceCount}/${workspaceLimit} used.`}
            </Text>
          </Flex>

          <Flex gap="2" align="center">
            {hasActiveSubscription ? (
              <Button
                variant="solid"
                onClick={handleManage}
                disabled={isPortalLoading}
              >
                {isPortalLoading ? "Loading..." : "Manage subscription"}
              </Button>
            ) : (
              <Button
                variant="solid"
                onClick={handleCheckout}
                disabled={isRedirecting}
              >
                {isRedirecting ? "Loading..." : "Upgrade to Pro"}
              </Button>
            )}
          </Flex>
        </Flex>

        {nextRenewal && (
          <Text color="gray" size="1" className="mt-3 block">
            Next renewal on {nextRenewal}.
          </Text>
        )}
      </Card>

      <Card>
        <Heading size="3" mb="2">
          More benefits
        </Heading>
        <Separator my="3" />
        <Flex direction="column" gap="3">
          <Flex align="center" gap="2">
            <HiOutlineArrowRight size="14" className="text-gray-500" />
            <Text>
              Free accounts can create a maximum of {workspaceLimit} workspace
              {workspaceLimit === 1 ? "" : "s"}.
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <HiOutlineArrowRight size="14" className="text-gray-500" />
            <Text>
              Pro accounts get direct access to new features
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <HiOutlineArrowRight size="14" className="text-gray-500" />
            <Text>
              You can downgrade or cancel at any time via the billing portal.
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Grid>
  );
};
