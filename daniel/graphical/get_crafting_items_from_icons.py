#!/usr/bin/env python3

import re
import sys
import json
from pathlib import Path


ps = [Path('..')/'static'/'minecraft-icons', Path('custom_icons')]
r = re.compile('(.*)_icon32.png')
m = [r.match(f.name) for p in ps for f in p.iterdir()]
print(f'{len([mm for mm in m if mm])} matches out of {len(m)}', file=sys.stderr)
print(
    (("var " + sys.argv[1] + ' = ') if len(sys.argv) > 1 else "") + json.dumps(
		[mm[1] for mm in m if mm],
        indent=4
    ) + (";" if len(sys.argv) > 1 else "")
)

