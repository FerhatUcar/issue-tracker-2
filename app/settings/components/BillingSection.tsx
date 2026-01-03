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
      toast.error("We konden je niet doorsturen naar de betaalpagina.");
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
      toast.error("We konden de abonnement instellingen niet openen.");
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
                ? "Je abonnement is actief."
                : "Upgrade om onbeperkt workspaces en features te gebruiken."}
            </Text>
          </div>
          <Badge color={hasActiveSubscription ? "green" : "orange"}>
            {hasActiveSubscription ? "Actief" : "Gratis"}
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
                ? "Onbeperkt"
                : `${ownedWorkspaceCount}/${workspaceLimit} gebruikt`}
            </Text>
          </Flex>

          <Flex gap="2" align="center">
            {hasActiveSubscription ? (
              <Button
                variant="solid"
                onClick={handleManage}
                disabled={isPortalLoading}
              >
                {isPortalLoading ? "Bezig..." : "Manage subscription"}
              </Button>
            ) : (
              <Button
                variant="solid"
                onClick={handleCheckout}
                disabled={isRedirecting}
              >
                {isRedirecting ? "Bezig..." : "Upgrade naar Pro"}
              </Button>
            )}
          </Flex>
        </Flex>

        {nextRenewal && (
          <Text color="gray" size="1" className="mt-3 block">
            Volgende verlenging op {nextRenewal}.
          </Text>
        )}
      </Card>

      <Card>
        <Heading size="3" mb="2">
          Meer voordelen
        </Heading>
        <Separator my="3" />
        <Flex direction="column" gap="3">
          <Text>
            * Free accounts kunnen maximaal {workspaceLimit} workspace
            {workspaceLimit === 1 ? "" : "s"} aanmaken.
          </Text>
          <Text>
            * Pro accounts krijgen directe toegang tot nieuwe features zoals
            uitgebreide meldingen en toekomstige bèta releases.
          </Text>
          <Text>
            * Je kan op elk moment downgraden of annuleren via het billing
            portal.
          </Text>
        </Flex>
      </Card>
    </Grid>
  );
};
