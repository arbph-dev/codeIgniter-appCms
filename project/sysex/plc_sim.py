# PLC Logic Block Simulation in Python

import time

class PLC:
    def __init__(self):
        self.inputs = {}
        self.outputs = {}
        self.timers = {}

    def set_input(self, name, value):
        self.inputs[name] = bool(value)

    def and_block(self, in1, in2):
        return self.inputs.get(in1, False) and self.inputs.get(in2, False)

    def or_block(self, in1, in2):
        return self.inputs.get(in1, False) or self.inputs.get(in2, False)

    def not_block(self, in1):
        return not self.inputs.get(in1, False)

    def timer_on_delay(self, name, input_signal, delay_sec):
        """Simulates TON (Timer On Delay)"""
        if name not in self.timers:
            self.timers[name] = {"start": None, "done": False}

        timer = self.timers[name]
        if input_signal:
            if timer["start"] is None:
                timer["start"] = time.time()
            elif time.time() - timer["start"] >= delay_sec:
                timer["done"] = True
        else:
            timer["start"] = None
            timer["done"] = False

        return timer["done"]

# Example usage
if __name__ == "__main__":
    plc = PLC()

    # Set inputs
    plc.set_input("I1", True)
    plc.set_input("I2", False)

    # Logic simulation
    print("AND Block:", plc.and_block("I1", "I2"))
    print("OR Block:", plc.or_block("I1", "I2"))
    print("NOT Block:", plc.not_block("I2"))

    # Timer simulation
    print("Starting timer...")
    for _ in range(5):
        done = plc.timer_on_delay("T1", plc.inputs["I1"], 3)
        print("Timer Done:", done)
        time.sleep(1)
