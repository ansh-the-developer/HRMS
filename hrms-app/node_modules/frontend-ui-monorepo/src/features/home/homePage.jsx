import { SimpleGrid, Grid, GridItem } from "@chakra-ui/react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import NoticeBoardCard from "@/components/atomic/organisms/NoticeBoardCard";
import HolidaysCard from "@/components/atomic/organisms/HolidaysCard";
import CompanyEventsCard from "@/components/atomic/organisms/CompanyEventsCard";
import BirthdayTrackerCard from "@/components/atomic/organisms/BirthdayTrackerCard";
import CalendarCard from "@/components/atomic/organisms/CalendarCard";

const HomePage = () => {
  return (
    <DashboardLayout>
      <SimpleGrid columns={1} spacing={6} mb={6}>
        <NoticeBoardCard />
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={6}>
        <GridItem>
          <HolidaysCard />
        </GridItem>
        <GridItem>
          <CompanyEventsCard />
        </GridItem>
      </Grid>
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={6}
        align="stretch"
      >
        <GridItem>
          <BirthdayTrackerCard />
        </GridItem>
        <GridItem>
          <CalendarCard />
        </GridItem>
      </Grid>
    </DashboardLayout>
  );
};

export default HomePage;
