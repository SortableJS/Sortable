# sanity check: make sure we're in the root directory of the example
cd "$( dirname "$0" )"

# delete temp files even if Ctrl+C is pressed
int_trap() {
  echo "Cleaning up..."
}
trap int_trap INT

ln -s "meteor/package.js" ../../package.js 2>/dev/null
ln -s "../../package.json" package.json 2>/dev/null

meteor run "$@"

rm ../../package.js package.json
