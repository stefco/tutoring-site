#!/usr/bin/env python3

import re
import sys
import json
from pathlib import Path


p = Path('..')/'static'/'minecraft-icons'
r = re.compile('(.*)_icon32.png')
m = [r.match(f.name) for f in p.iterdir()]
print(f'{len([mm for mm in m if mm])} matches out of {len(m)}', file=sys.stderr)
print(
    ("var " + (sys.argv[1] + ' = ') if len(sys.argv) > 1 else "") + json.dumps(
        [r.sub(lambda m: m[1], f.name) for f, mm in zip(p.iterdir(), m) if m],
        indent=4
    ) + (";" if len(sys.argv) > 1 else "")
)

