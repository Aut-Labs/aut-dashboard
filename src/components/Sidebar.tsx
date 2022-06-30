import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { SwScrollbar } from "sw-web-shared";
import { ReactComponent as AutLogo } from "@assets/aut/logo.svg";
import {
  Collapse,
  Container,
  CssBaseline,
  styled,
  SvgIcon,
  Toolbar,
} from "@mui/material";
import { ReactComponent as ManageIcon } from "@assets/manage.svg";
import { ReactComponent as TasksIcon } from "@assets/tasks.svg";
import { ReactComponent as DashboardIcon } from "@assets/dashboard.svg";
import { ReactComponent as IntegrationIcon } from "@assets/integration.svg";
import { NavLink, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { pxToRem } from "@utils/text-size";

const menuItems: any[] = [
  {
    title: "Home",
    route: "/aut-dashboard",
    exact: true,
    icon: DashboardIcon,
  },
  {
    title: "Integrations & Contracts",
    route: "/aut-dashboard/integrations-and-contracts",
    icon: IntegrationIcon,
  },
  {
    title: "DAO Management",
    icon: ManageIcon,
    children: [
      {
        title: "- Members",
        route: "/aut-dashboard/members",
      },
      {
        title: "- Roles",
        route: "/aut-dashboard/roles",
      },
      {
        title: "- Share",
        route: "/aut-dashboard/share",
      },
    ],
  },
  {
    title: "Event Factory",
    icon: TasksIcon,
    children: [
      {
        title: "- Community Calls",
        route: "/aut-dashboard/event-factory/group-call",
      },
      {
        title: "- Polls",
        route: "/aut-dashboard/event-factory/polls",
      },
    ],
  },
  // {
  //   title: "Tasks",
  //   route: "/aut-dashboard/tasks",
  //   icon: Tasks,
  //   children: [
  //     {
  //       title: "- All Tasks",
  //       route: "/aut-dashboard/tasks",
  //       icon: EditIcon,
  //     },
  //     {
  //       title: "- Your Tasks",
  //       route: "/aut-dashboard/your-tasks",
  //       icon: YourTasks,
  //     },
  //   ],
  // },
];

const drawerWidth = 350;
const toolbarHeight = 130;

const AutDrawer = styled(Drawer)({
  width: pxToRem(drawerWidth),
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    backgroundColor: "#000",
    width: pxToRem(drawerWidth),
    marginTop: 0,
    boxSizing: "border-box",
    borderImage:
      "linear-gradient(160deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 1",
    borderRightWidth: "3px",
    borderLeftWidth: "12px",
    borderColor: "transparent",
    borderTop: 0,
    borderBottom: 0,
  },
});

const AutMenuItem = styled<any>(ListItem)(({ menu }) => ({
  border: 0,
  height: pxToRem(60),
  paddingTop: 0,
  paddingBottom: 0,
  borderLeft: "0",
  borderTop: "1px",
  ...(!menu.children?.length && {
    borderBottom: "1px",
  }),
  borderStyle: "solid",
  borderColor: "#439EDD",
  letterSpacing: "1.25px",
  background: `linear-gradient(to left, transparent 50%, #6FA1C3 50%) right`,
  backgroundSize: "200%",
  transition: ".2s ease-out",
  "&.active-group-link, &.active-child-route": {
    borderColor: "#439EDD",
    "+ .MuiCollapse-root": {
      borderColor: "#439EDD",
    },
  },
  "&:not(.active-child-route).active-group-link": {
    backgroundPosition: "left",
  },
}));

const AutChildMenuItem = styled<any>(ListItem)(({ menu }) => ({
  py: pxToRem(10),
  width: "100%",
  height: pxToRem(40),
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: pxToRem(50),
  letterSpacing: "1.25px",
  background: `linear-gradient(to left, transparent 50%, #6FA1C3 50%) right`,
  backgroundSize: "200%",
  transition: ".2s ease-out",
  "&.active-link": {
    backgroundPosition: "left",
    ".MuiTypography-root": {
      color: "white",
    },
  },
}));

export default function SidebarDrawer({ children }) {
  const location = useLocation();

  const isInChildRoute = (menu) => {
    const isIn =
      menu?.children?.length &&
      (menu?.children as any[]).some(({ route }) =>
        location.pathname.includes(route)
      );
    return isIn;
  };

  const menuContent = (
    <List sx={{ width: "100%", bgcolor: "background.primary" }} component="nav">
      {menuItems.map((menu, index) => {
        const routeParams = menu.disabled || !menu.route
          ? {}
          : {
              component: NavLink,
              activeClassName: "active-group-link",
              to: menu.route,
              exact: menu.exact
            };
        return (
          <Fragment key={`menu-item-${menu.title}-${index}`}>
            <AutMenuItem
              menu={menu}
              className={`${isInChildRoute(menu) ? "active-child-route" : ""}`}
              disabled={menu.disabled}
              {...routeParams}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  pr: 2,
                  minWidth: "auto",
                }}
              >
                <SvgIcon
                  sx={{
                    height: pxToRem(19),
                    width: pxToRem(19),
                  }}
                  component={menu.icon}
                  inheritViewBox
                />
              </ListItemIcon>
              <Typography
                sx={{ color: "white" }}
                component="div"
                fontSize={pxToRem(20)}
              >
                {menu.title}
              </Typography>
            </AutMenuItem>
            {menu.children && (
              <Collapse
                in
                sx={{
                  border: 0,
                  pb: "2px",
                  borderLeft: "0",
                  borderBottom: "1px",
                  borderStyle: "solid",
                  borderColor: "transparent",
                }}
              >
                <List component="div" disablePadding>
                  {menu.children.map((childMenu, childIndex) => {
                    return (
                      <AutChildMenuItem
                        component={NavLink}
                        activeClassName="active-link"
                        to={childMenu.route}
                        key={`child-menu-item-${childMenu.title}-${childIndex}`}
                      >
                        <Typography
                          sx={{ color: "white" }}
                          component="div"
                          fontSize={pxToRem(20)}
                        >
                          {childMenu.title}
                        </Typography>
                      </AutChildMenuItem>
                    );
                  })}
                </List>
              </Collapse>
            )}
          </Fragment>
        );
      })}
    </List>
  );

  return (
    <>
      <CssBaseline />
      <AutDrawer variant="permanent">
        <Toolbar
          sx={{
            p: "0px !important",
            minHeight: `${pxToRem(200)} !important`,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: pxToRem(350),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <AutLogo style={{ height: pxToRem(70) }} />
            <Typography
              component="div"
              sx={{
                color: "white",
                mt: pxToRem(5),
                fontSize: pxToRem(16),
              }}
            >
              Claim your Role
            </Typography>
          </div>
        </Toolbar>
        {menuContent}
      </AutDrawer>
      <Box
        component="main"
        sx={{
          ml: pxToRem(drawerWidth),
          height: `calc(100% - ${pxToRem(toolbarHeight)})`,
          mt: pxToRem(toolbarHeight),
          flexGrow: 1,
          p: "0",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "black",
          }}
        >
          <SwScrollbar
            sx={{
              height: `calc(100%)`,
              flex: 1,
              p: 0,
            }}
          >
            <Container
              className="main-container"
              maxWidth={false}
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
              disableGutters
            >
              {children}
            </Container>
          </SwScrollbar>
        </Box>
      </Box>
    </>
  );
}