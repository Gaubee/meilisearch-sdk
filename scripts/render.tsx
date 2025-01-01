import {
  Box,
  Text,
  Spacer,
  render,
  measureElement,
  useInput,
  useApp,
} from "ink";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as colors from "@std/fmt/colors";

import byteSize from "byte-size";
import { doDownload } from "./download-binary.ts";

const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => {
  const ref = useRef();

  let content = "";
  if (ref.current) {
    const { width, height } = measureElement(ref.current);
    const loaded = Math.max(0, Math.round(percent * width));
    const rest = Math.max(0, width - loaded);
    content = colors.cyan("█".repeat(loaded) + "░".repeat(rest));
  }
  // █░

  return (
    <Box flexGrow={1} ref={ref as any}>
      <Text>{content}</Text>
    </Box>
  );
};
const PanelView: React.FC<{
  filename: string;
  total: number;
  loaded: number;
}> = ({ filename, total, loaded }) => {
  const startTime = useMemo(() => Date.now(), []);
  const speed =
    byteSize(loaded / ((Date.now() - startTime) / 1000) || 0) + "/s";
  const totalByteResult = useMemo(() => byteSize(total, {}), [total]);
  return (
    <Box flexDirection="column" borderStyle="round" gap={1}>
      <Box flexDirection="row" gap={1}>
        <Text color="gray">File: {colors.blue(filename)}</Text>
        <Text color="gray">Speed: {colors.green(speed)}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <ProgressBar percent={loaded / total} />
        <Box marginLeft={1} minWidth={20} justifyContent="flex-end">
          <Text color="green">
            {byteSize(loaded, { precision: 1 }).toString()}
            {" / "}
            {totalByteResult.toString()}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const MainView = () => {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input === "c" && (key.ctrl || key.meta)) {
      exit();
    }
  });

  const [filename, setFilename] = useState("");
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    const aborter = new AbortController();
    let download = 0;
    doDownload({
      signal: aborter.signal,
      emitter: (state) => {
        if (state.type === "start") {
          setFilename(state.filename);
          setTotal(state.total);
          setLoaded((download = 0));
        } else if (state.type === "progress") {
          setLoaded((download += state.chunkSize));
        } else if (state.type === "done") {
          exit();
        }
      },
    });
    return () => aborter.abort("cancel");
  }, []);
  return (
    <PanelView filename={filename} total={total} loaded={loaded}></PanelView>
  );
};

export default function () {
  render(<MainView />);
}
