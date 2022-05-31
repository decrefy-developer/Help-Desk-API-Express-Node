//funtion change to boolean
export function ToBoolean(status: string) {
  let result: boolean;
  if (status === "true") {
    result = true;
  } else if (!status) {
    result = true;
  } else {
    result = false;
  }

  return result;
}
