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
import { doDownload, DownloadOptions } from "./download-binary.ts";

const ProgressBar = ({ percent }: { percent: number }) => {
  const ref = useRef<any>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const { width: measuredWidth } = measureElement(ref.current);
      setWidth(measuredWidth);
    }
  }, []); // Run once on mount

  let content = "";
  if (width > 0) {
    const loaded = Math.max(0, Math.round(percent * width));
    const rest = Math.max(0, width - loaded);
    content = colors.cyan("█".repeat(loaded) + "░".repeat(rest));
  }

  return (
    <Box flexGrow={1} height={1} ref={ref}>
      <Text>{content}</Text>
    </Box>
  );
};
const PanelView = ({
  filename,
  total,
  loaded,
}: {
  filename: string;
  total: number;
  loaded: number;
}) => {
  const startTime = useMemo(() => Date.now(), []);
  const speed =
    byteSize(loaded / ((Date.now() - startTime) / 1000) || 0) + "/s";
  const totalByteResult = useMemo(() => byteSize(total, {}), [total]);
  const percent = total === 0 ? 0 : loaded / total;
  return (
    <Box flexDirection="column" borderStyle="round" gap={1}>
      <Box flexDirection="row" gap={1}>
        <Text color="gray">File: {colors.blue(filename)}</Text>
        <Text color="gray">Speed: {colors.green(speed)}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <ProgressBar percent={percent} />
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

const MainView = (props: DownloadOptions) => {
  const { exit } = useApp();
  useInput((input, key) => {
    if (input === "c" && (key.ctrl || key.meta)) {
      exit();
    }
  });

  let [filename, setFilename] = useState("");
  const [total, setTotal] = useState(1);
  const [loaded, setLoaded] = useState(0);
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const aborter = new AbortController();
    let download = 0;
    doDownload({
      ...props,
      signal: aborter.signal,
      emitter: (state) => {
        if (state.type === "start") {
          setFilename((filename = state.filename)); // filename 可能会被立刻使用，所以这里手动赋值
          setTotal(state.total);
          setLoaded((download = 0));
        } else if (state.type === "progress") {
          setLoaded((download += state.chunkSize));
          if (download >= total) {
            setDownloadedFiles([...downloadedFiles, filename]);
          }
        } else if (state.type === "done") {
          setDone(true);
          setTimeout(() => {
            exit();
          });
        }
      },
    });
    return () => aborter.abort("cancel");
  }, []);
  return (
    <Box flexDirection="column" gap={1}>
      {downloadedFiles.map((filename, i) => (
        <Text key={i} color="gray">
          ✅ File: {colors.blue(filename)}
        </Text>
      ))}
      {done ? null : (
        <PanelView
          filename={filename}
          total={total}
          loaded={loaded}
        ></PanelView>
      )}
    </Box>
  );
};

export default function (opts: DownloadOptions) {
  render(<MainView {...opts} />);
}
