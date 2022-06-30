import { MenuItem, styled, Typography } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { useHistory } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { pxToRem } from "@utils/text-size";
import {
  CreatePollData,
  CreatePollError,
  CreatePollStatus,
  createPollUpdateStatus,
  pollUpdateData,
} from "@store/Activity/create-poll.reducer";
import { useState } from "react";
import { useSelector } from "react-redux";
import ErrorDialog from "@components/ErrorPopup";
import LoadingDialog from "@components/LoadingPopup";
import { ResultState } from "@store/result-status";
import { addPoll } from "@api/activities.api";
import { AutHeader } from "@components/AutHeader";
import { AutSelectField } from "@components/Fields";
import { AutButton } from "@components/buttons";
import { allRoles } from "@store/Community/community.reducer";

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
});

const CreatePollParticipantsStep = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [roles] = useState(useSelector(allRoles));
  const status = useSelector(CreatePollStatus);
  const errorMessage = useSelector(CreatePollError);
  const data = useSelector(CreatePollData);

  const { control, handleSubmit, watch, reset } = useForm({
    mode: "onSubmit",
    defaultValues: {
      role: data.role,
      allRoles: data.allRoles,
    },
  });

  const values = watch();
  const handleDialogClose = () => {
    dispatch(createPollUpdateStatus(ResultState.Idle));
  };

  const onSubmit = async () => {
    const { emojis, options } = data.options.reduce(
      (prev, { option, emoji }) => {
        prev.emojis = [...prev.emojis, emoji];
        prev.options = [...prev.options, option];
        return prev;
      },
      {
        emojis: [],
        options: [],
      }
    );
    const metadata = {
      ...data,
      ...values,
      options,
      emojis,
    };

    await dispatch(pollUpdateData(values));
    const result = await dispatch(addPoll(metadata));
    if (result.meta.requestStatus === "fulfilled") {
      history.push("/aut-dashboard/event-factory/polls/success");
    }
  };

  return (
    <>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage || "Something went wrong"}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Updating}
        message="Creating community poll..."
      />
      <AutHeader
        title=" Polls"
        titleStyles={{
          m: 0,
        }}
        subtitle={
          <>
            Decide whether this is a Poll for the entire Community, or for a
            specific Role. <br /> Who will participate in this Poll?
          </>
        }
      />
      <StepWrapper
        className="sw-poll-participants-wrapper"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          rules={{
            required: !values.allRoles,
          }}
          name="role"
          control={control}
          render={({ field: { name, value, onChange } }) => {
            return (
              <AutSelectField
                variant="standard"
                autoFocus
                renderValue={(selected) => {
                  if (!selected) {
                    return "Select One";
                  }
                  return selected;
                }}
                width="450"
                name={name}
                color="primary"
                value={value || ""}
                displayEmpty
                disabled={values.allRoles}
                required={!values.allRoles}
                onChange={onChange}
              >
                {roles.map((r, index) => (
                  <MenuItem
                    color="primary"
                    key={`role-option-key-${r.roleName}-${index}`}
                    value={r.roleName}
                  >
                    {r.roleName}
                  </MenuItem>
                ))}
              </AutSelectField>
            );
          }}
        />

        <Controller
          name="allRoles"
          control={control}
          render={({ field: { name, value, onChange } }) => {
            return (
              <AutButton
                name={name}
                type="button"
                onClick={() => {
                  reset({
                    role: null,
                    allRoles: !value,
                  });
                }}
                className={value ? "active-link" : ""}
                sx={{
                  maxWidth: pxToRem(450),
                  minHeight: pxToRem(50),
                  "&.MuiButton-root": {
                    borderRadius: 0,
                    borderWidth: "2px",
                  },
                }}
              >
                <Typography variant="body2">All of the Community</Typography>
              </AutButton>
            );
          }}
        />

        <AutButton
          sx={{
            minWidth: pxToRem(325),
            maxWidth: pxToRem(325),
            height: pxToRem(70),
            mt: pxToRem(100),
          }}
          type="submit"
          color="primary"
          variant="outlined"
          disabled={!values?.role && !values.allRoles}
        >
          Submit
        </AutButton>
      </StepWrapper>
    </>
  );
};

export default CreatePollParticipantsStep;